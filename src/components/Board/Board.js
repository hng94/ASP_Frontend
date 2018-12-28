import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { Helmet } from "react-helmet";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classnames from "classnames";
import List from "../List/List";
import ListAdder from "../ListAdder/ListAdder";
import Header from "../Header/Header";
import BoardHeader from "../BoardHeader/BoardHeader";
import "./Board.scss";
import { debug } from "util";
import { boardActions } from '../../actions/boardActions'
import { UPDATE_CURRENT_BOARD_ID, DELETE_LIST_SUCCESS, ADD_LIST_SUCCESS, CHANGE_LIST_TITLE_SUCCESS, MOVE_LIST_SUCCESS, ADD_CARD_SUCCESS, MOVE_CARD_SUCCESS, CHANGE_CARD_TITLE_SUCCESS, DELETE_CARD_SUCCESS } from "../../actions/actionTypes";
import { listActions } from "../../actions/listActions";
import { cardActions } from "../../actions/cardActions";

class Board extends Component {
  // static propTypes = {
  //   lists: PropTypes.arrayOf(
  //     PropTypes.shape({ _id: PropTypes.string.isRequired })
  //   ).isRequired,
  //   boardId: PropTypes.string.isRequired,
  //   boardTitle: PropTypes.string.isRequired,
  //   boardColor: PropTypes.string.isRequired,
  //   dispatch: PropTypes.func.isRequired
  // };

  constructor(props) {
    super(props);
    this.state = {
      startX: null,
      startScrollX: null
    };
  }

  // boardId is stored in the redux store so that it is available inside middleware
  componentWillMount() {
    const { boardId, dispatch, socket } = this.props;
    dispatch({
      type: UPDATE_CURRENT_BOARD_ID,
      payload: boardId
    })

    dispatch(boardActions.getById(boardId));

    socket.on(ADD_LIST_SUCCESS, (list) => {
      dispatch(listActions.addListSuccess({
        boardId,
        list
      }))
    });

    socket.on(CHANGE_LIST_TITLE_SUCCESS, (list) => {
      dispatch(listActions.changeListTitleSuccess(list));
    });

    socket.on(DELETE_LIST_SUCCESS, data => {
      dispatch(listActions.deleteListSuccess(data));
    })

    socket.on(MOVE_LIST_SUCCESS, data => {
      dispatch(listActions.moveListSuccess(data));
    })

    socket.on(ADD_CARD_SUCCESS, data => {
      dispatch(cardActions.addCardSuccess(data));
    })

    socket.on(MOVE_CARD_SUCCESS, data => {
      dispatch(cardActions.moveCardSuccess(data));
    })

    socket.on(CHANGE_CARD_TITLE_SUCCESS, data => {
      dispatch(cardActions.changeCardTitleSuccess(data))
    })

    socket.on(DELETE_CARD_SUCCESS, data => {
      dispatch(cardActions.deleteCardSuccess(data))
    })
  };

  componentWillUnmount() {
    const { socket } = this.props;
    socket.disconnect();
  }

  handleDragEnd = ({ source, destination, type }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }
    const { dispatch, boardId, socket } = this.props;

    // Move list
    if (type === "COLUMN") {
      // Prevent update if nothing has changed
      if (source.index !== destination.index) {
        const data = {
          oldListIndex: source.index,
          newListIndex: destination.index,
          boardId: source.droppableId
        };
        dispatch(listActions.moveListRequest(socket, data));
      }
      return;
    }
    // Move card
    if (
      source.index !== destination.index ||
      source.droppableId !== destination.droppableId
    ) {
      const data = {
        sourceListId: source.droppableId,
        destListId: destination.droppableId,
        oldCardIndex: source.index,
        newCardIndex: destination.index,
        boardId
      };
      dispatch(cardActions.moveCardRequest(socket, data));
    }
  };

  // The following three methods implement dragging of the board by holding down the mouse
  handleMouseDown = ({ target, clientX }) => {
    if (target.className !== "list-wrapper" && target.className !== "lists") {
      return;
    }
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    this.setState({
      startX: clientX,
      startScrollX: window.scrollX
    });
  };

  // Go to new scroll position every time the mouse moves while dragging is activated
  handleMouseMove = ({ clientX }) => {
    const { startX, startScrollX } = this.state;
    const scrollX = startScrollX - clientX + startX;
    window.scrollTo(scrollX, 0);
    const windowScrollX = window.scrollX;
    if (scrollX !== windowScrollX) {
      this.setState({
        startX: clientX + windowScrollX - startScrollX
      });
    }
  };

  // Remove drag event listeners
  handleMouseUp = () => {
    if (this.state.startX) {
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("mouseup", this.handleMouseUp);
      this.setState({ startX: null, startScrollX: null });
    }
  };

  handleWheel = ({ target, deltaY }) => {
    // Scroll page right or left as long as the mouse is not hovering a card-list (which could have vertical scroll)
    if (
      target.className !== "list-wrapper" &&
      target.className !== "lists" &&
      target.className !== "open-composer-button" &&
      target.className !== "list-title-button"
    ) {
      return;
    }
    // Move the board 80 pixes on every wheel event
    if (Math.sign(deltaY) === 1) {
      window.scrollTo(window.scrollX + 80, 0);
    } else if (Math.sign(deltaY) === -1) {
      window.scrollTo(window.scrollX - 80, 0);
    }
  };

  render = () => {
    const { lists, board, boardId, boardLoading, listLoading } = this.props;
    if (boardLoading) {
      return (
        <p>Board loading</p>
      )
    }
    if (!board) {
      return (
        <p>Board not found</p>
      )
    }
    return (
      <>
        <div className={classnames("board", "blue")}>
          {/* <Helmet>
            <title>{boardTitle} | React Kanban</title>
          </Helmet> */}
          <Header />
          <BoardHeader />
          {/* eslint-disable jsx-a11y/no-static-element-interactions */}
          <div
            className="lists-wrapper"
            onMouseDown={this.handleMouseDown}
            onWheel={this.handleWheel}
          >
            {/* eslint-enable jsx-a11y/no-static-element-interactions */}
            {listLoading && <p>List loading</p>}
            {!listLoading && <DragDropContext onDragEnd={this.handleDragEnd}>
              <Droppable
                droppableId={boardId}
                type="COLUMN"
                direction="horizontal"
              >
                {provided => (
                  <div className="lists" ref={provided.innerRef}>
                    {lists.map((list, index) => (
                      <List
                        list={list}
                        boardId={boardId}
                        index={index}
                        key={list._id}
                      />
                    ))}
                    {provided.placeholder}
                    <ListAdder boardId={boardId} />
                  </div>
                )}
              </Droppable>
            </DragDropContext>}
          </div>
          <div className="board-underlay" />
        </div>
      </>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  const { boardId } = ownProps.match.params;
  const { socket } = state;
  const board = state.boards.byId[boardId];
  const boardLoading = state.boards.loading;
  if (!board) return {
    socket,
    boardLoading,
    boardId
  };
  const lists = board.lists.map(id => state.lists.byId[id]);
  const listLoading = state.lists.loading;
  return {
    socket,
    lists,
    listLoading,
    board,
    boardLoading,
    boardId,
  };
};

export default connect(mapStateToProps)(Board);
