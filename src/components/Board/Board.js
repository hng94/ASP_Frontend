import React, { Component } from "react";
import { connect } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import classnames from "classnames";
import List from "../List/List";
import ListAdder from "../ListAdder/ListAdder";
import Header from "../Header/Header";
import BoardHeader from "../BoardHeader/BoardHeader";
import "./Board.scss";
import { boardActions } from '../../actions/boardActions'
import { UPDATE_CURRENT_BOARD_ID, DELETE_LIST_SUCCESS, ADD_LIST_SUCCESS, CHANGE_LIST_TITLE_SUCCESS, MOVE_LIST_SUCCESS, ADD_CARD_SUCCESS, MOVE_CARD_SUCCESS, CHANGE_CARD_TITLE_SUCCESS, DELETE_CARD_SUCCESS, UPDATE_MEMBER_SUCCESS, DELETE_BOARD_SUCCESS, GET_BOARD_REQUEST, GET_LIST_REQUEST, GET_CARD_REQUEST } from "../../actions/actionTypes";
import { listActions } from "../../actions/listActions";
import { cardActions } from "../../actions/cardActions";
import { Select, Modal, Spin, notification } from 'antd';
import debounce from 'lodash/debounce';
import axios from 'axios';
import { history } from '../../helpers';
import PropTypes from "prop-types";
import { stat } from "fs";
import { debug } from "util";

const baseURL = 'http://localhost:4000/api';

const confirm = Modal.confirm;

class Board extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    // lists: PropTypes.arrayOf(
    //   PropTypes.shape({ _id: PropTypes.string.isRequired })
    // ).isRequired,
    listLoading: PropTypes.bool.isRequired,
    // board: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired,
    boardId: PropTypes.string.isRequired,
    boardLoading: PropTypes.bool.isRequired,
    user: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      startX: null,
      startScrollX: null,
      value: [],
      data: [],
      fetching: false
    };
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  // boardId is stored in the redux store so that it is available inside middleware
  componentWillMount() {
    const { boardId, dispatch, socket, user } = this.props;

    dispatch({
      type: UPDATE_CURRENT_BOARD_ID,
      payload: boardId
    })

    dispatch(boardActions.getById(user.email, boardId));

    //Lists
    socket.on(ADD_LIST_SUCCESS, (res) => {
      if (boardId !== res.boardId) return;
      dispatch(listActions.addListSuccess(res))
    });

    socket.on(CHANGE_LIST_TITLE_SUCCESS, (res) => {
      if (boardId !== res.boardId) return;
      dispatch(listActions.changeListTitleSuccess(res.list));
    });

    socket.on(DELETE_LIST_SUCCESS, data => {
      dispatch(listActions.deleteListSuccess(data));
    })

    socket.on(MOVE_LIST_SUCCESS, data => {
      dispatch(listActions.moveListSuccess(data));
    })

    //Cards
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

    //Members
    socket.on(UPDATE_MEMBER_SUCCESS, ({ board, email }) => {
      if (board._id !== boardId) return;
      if (board.users.includes(user.email)) {
        dispatch({
          type: UPDATE_MEMBER_SUCCESS,
          payload: board
        })
      }
      else {
        Modal.warn({
          title: 'Attention',
          content: <p>You are removed from board <strong>{board.title}</strong></p>,
          onOk() {
            history.push('/');
            dispatch({
              type: DELETE_BOARD_SUCCESS,
              payload: board._id
            });
          }
        });
      }
    })
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: GET_CARD_REQUEST
    })
    dispatch({
      type: GET_LIST_REQUEST
    })
    dispatch({
      type: GET_BOARD_REQUEST
    })
  }

  handleDragEnd = ({ source, destination, type }) => {
    // dropped outside the list
    if (!destination) {
      return;
    }
    const { board, dispatch, boardId, socket, listById } = this.props;
    // Move list
    if (type === "COLUMN") {
      const sourceListId = board.lists[source.index];
      const destListId = board.lists[destination.index];
      // Prevent update if nothing has changed
      if (source.index !== destination.index) {
        const data = {
          sourceListId,
          destListId,
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
      const cardId = listById[source.droppableId].cards[source.index];
      const data = {
        cardId,
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

  fetchUser = (value) => {
    console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    axios.get(`${baseURL}/users/search/${value}`)
      .then((response) => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = response.data.map(user => ({
          text: user.email,
          value: user.email,
        }));
        this.setState({ data, fetching: false });
      });
  }

  handleDeselect = (value) => {
    const { user, board, dispatch, socket } = this.props;
    if (value === user.email) {
      Modal.error({
        title: 'Error',
        content: 'Can not remove owner.',
        onOk() {
          console.log('Bye bye');
        }
      });
    }
    else {
      confirm({
        title: 'Are you sure to remove this member?',
        content: 'Removed members can not access to this board anymore.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          const req = {
            owner: user.email,
            email: value,
            _id: board._id
          };
          dispatch(boardActions.removeMember(socket, req));
        },
        onCancel() {
        },
      });
    }
  }

  handleSelect = (value) => {
    const { user, board, dispatch, socket } = this.props;
    const req = {
      owner: user.email,
      email: value,
      _id: board._id
    }
    dispatch(boardActions.addMember(socket, req));
  }

  render = () => {
    const { lists, board, boardId, boardLoading, listLoading, cardLoading } = this.props;
    // const lists = board.lists.map(id => listById.byId[id]);
    const { data, fetching } = this.state;
    const Option = Select.Option;
    return (
      <>
        {boardLoading ? (<Spin size="large" />) : (
          <div className={classnames("board", "blue")}>
            <div>
              <Header />
              <BoardHeader />
              <div
                className="lists-wrapper"
                onMouseDown={this.handleMouseDown}
                onWheel={this.handleWheel}
              >
                <div className="add-user">
                  <Select
                    mode="multiple"
                    style={{ minWidth: '300px' }}
                    value={board.users}
                    placeholder="Select users"
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={this.fetchUser}
                    onDeselect={this.handleDeselect}
                    onSelect={this.handleSelect}
                  >
                    {data.map(d => <Option key={d.value}>{d.text}</Option>)}
                  </Select>
                </div>
                {/* eslint-enable jsx-a11y/no-static-element-interactions */}
                {!listLoading && (
                  <DragDropContext onDragEnd={this.handleDragEnd}>
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
                  </DragDropContext>
                )}
              </div>
              <div className="board-underlay" />
            </div>
          </div>
        )}
      </>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  const { boardId } = ownProps.match.params;
  const { socket } = state;
  const boardLoading = state.boards.loading;
  const listLoading = state.lists.loading;
  const board = state.boards.byId[boardId];
  const listById = state.lists.byId;
  let lists;
  if (!listLoading) {
    lists = (board) ? board.lists.map(id => listById[id]) : undefined;
  }
  const cardLoading = state.cards.loading;
  return {
    socket,
    lists,
    listById,
    listLoading,
    board,
    boardLoading,
    boardId,
    cardLoading,
    user: state.user
  };
};

export default connect(mapStateToProps)(Board);
