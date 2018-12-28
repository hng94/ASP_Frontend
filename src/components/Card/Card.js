import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import classnames from "classnames";
import CardHeader from './CardHeader';
import "./Card.scss";

class Card extends Component {
  // static propTypes = {
  //   card: PropTypes.shape({
  //     _id: PropTypes.string.isRequired,
  //     text: PropTypes.string.isRequired,
  //     color: PropTypes.string
  //   }).isRequired,
  //   listId: PropTypes.string.isRequired,
  //   isDraggingOver: PropTypes.bool.isRequired,
  //   index: PropTypes.number.isRequired,
  //   dispatch: PropTypes.func.isRequired
  // };

  constructor() {
    super();
    this.state = {
      isModalOpen: false,
      editting: false
    };
  }

  toggleCardEditor = () => {
    this.setState({ editting: !this.state.editting });
  };

  handleClick = event => {
    const { tagName, checked, id } = event.target;
    console.log('Click card ', this.props.card);
    this.toggleCardEditor();
  };

  handleKeyDown = event => {
    // Only open card on enter since spacebar is used by react-beautiful-dnd for keyboard dragging
    if (event.keyCode === 13 && event.target.tagName.toLowerCase() !== "a") {
      event.preventDefault();
      this.toggleCardEditor();
    }
  };

  // identify the clicked checkbox by its index and give it a new checked attribute
  toggleCheckbox = (checked, i) => {
    const { card, dispatch } = this.props;

    let j = 0;
    const newText = card.title.replace(/\[(\s|x)\]/g, match => {
      let newString;
      if (i === j) {
        newString = checked ? "[x]" : "[ ]";
      } else {
        newString = match;
      }
      j += 1;
      return newString;
    });

    dispatch({
      type: "CHANGE_CARD_TEXT",
      payload: { cardId: card._id, cardText: newText }
    });
  };

  render() {
    const { card, index, listId, isDraggingOver } = this.props;
    const { isModalOpen } = this.state;
    // const checkboxes = findCheckboxes(card.text);
    return (
      <>
        <Draggable draggableId={card._id} index={index}>
          {(provided, snapshot) => (
            <>
              {/* eslint-disable */}
              <div
                className={classnames("card-title", {
                  "card-title--drag": snapshot.isDragging
                })}
                ref={ref => {
                  provided.innerRef(ref);
                  this.ref = ref;
                }}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={event => {
                  // provided.dragHandleProps.onClick(event);
                  this.handleClick(event);
                }}
                onKeyDown={event => {
                  provided.dragHandleProps.onKeyDown(event);
                  this.handleKeyDown(event);
                }}
                style={{
                  ...provided.draggableProps.style,
                  background: 'white'
                }}
              >
                <CardHeader
                  dragHandleProps={provided.dragHandleProps}
                  cardTitle={card.title}
                  cardId={card._id}
                  listId={listId}
                />
              </div>
              {/* Remove placeholder when not dragging over to reduce snapping */}
              {isDraggingOver && provided.placeholder}
            </>
          )}
        </Draggable>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    card: state.cards.byId[ownProps.cardId]
  }
};


export default connect(mapStateToProps)(Card);
