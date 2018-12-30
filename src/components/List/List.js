import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";
import ListHeader from "./ListHeader";
import Cards from "./Cards";
import CardAdder from "../CardAdder/CardAdder";
import "./List.scss";
import { Spin } from "antd";

class List extends Component {
  static propTypes = {
    boardId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    list: PropTypes.shape({ _id: PropTypes.string.isRequired }).isRequired
  };

  render = () => {
    const { list, boardId, index, listLoading, cardLoading } = this.props;
    return (
      <div>
        {listLoading ? (<Spin />) : (
          <Draggable
            draggableId={list._id}
            index={index}
            disableInteractiveElementBlocking
          >
            {(provided, snapshot) => (
              <>
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className="list-wrapper"
                >
                  <div
                    className={classnames("list", {
                      "list--drag": snapshot.isDragging
                    })}
                  >
                    <ListHeader
                      dragHandleProps={provided.dragHandleProps}
                      listTitle={list.title}
                      listId={list._id}
                      cards={list.cards}
                      boardId={boardId}
                    />
                    <div className="cards-wrapper">
                      {!cardLoading && (<Cards listId={list._id} />)}
                    </div>
                  </div>
                  <CardAdder listId={list._id} />
                </div>
                {provided.placeholder}
              </>
            )}
          </Draggable>
        )}
      </div>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    listLoading: state.lists.loading,
    cardLoading: state.cards.loading
  }
};

export default connect(mapStateToProps)(List);
