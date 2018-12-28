import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";
import { FaTrash } from "react-icons/fa";
import "./CardHeader.scss";
import { cardActions } from "../../actions/cardActions";

class CardTitle extends Component {
  static propTypes = {
    cardTitle: PropTypes.string.isRequired,
    cardId: PropTypes.string.isRequired,
    cardId: PropTypes.string.isRequired,
    // cards: PropTypes.arrayOf(PropTypes.string).isRequired,
    dragHandleProps: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newTitle: props.cardTitle
    };
  }

  handleChange = event => {
    this.setState({ newTitle: event.target.value });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.handleSubmit();
    } else if (event.keyCode === 27) {
      this.revertTitle();
    }
  };

  handleSubmit = () => {
    const { newTitle } = this.state;
    const { cardTitle, cardId, dispatch, socket } = this.props;
    if (newTitle === "") return;
    if (newTitle !== cardTitle) {
      const data = {
        _id: cardId,
        title: newTitle
      }
      dispatch(cardActions.changeCardTitleRequest(socket, data))
    }
    this.setState({ isOpen: false });
  };

  revertTitle = () => {
    this.setState({ newTitle: this.props.cardTitle, isOpen: false });
  };

  deletecard = () => {
    const { cardId, listId, dispatch, socket } = this.props;
    dispatch(cardActions.deleteCardRequest(socket, { listId, cardId }))
  };

  openTitleEditor = () => {
    this.setState({ isOpen: true });
  };

  handleButtonKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.openTitleEditor();
    }
  };

  render() {
    const { isOpen, newTitle } = this.state;
    const { dragHandleProps, cardTitle } = this.props;
    return (
      <div className="card-header">
        {isOpen ? (
          <div className="card-title-textarea-wrapper">
            <Textarea
              autoFocus
              useCacheForDOMMeasurements
              value={newTitle}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              className="card-title-textarea"
              onBlur={this.handleSubmit}
              spellCheck={false}
            />
          </div>
        ) : (
            <div
              {...dragHandleProps}
              role="button"
              tabIndex={0}
              onClick={this.openTitleEditor}
              onKeyDown={event => {
                this.handleButtonKeyDown(event);
                dragHandleProps.onKeyDown(event);
              }}
              className="card-title-button"
            >
              {cardTitle}
            </div>
          )}
        <button className="btn btn-default delete-card-button" onClick={this.deletecard}>
          <FaTrash />
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  socket: state.socket
});

export default connect(mapStateToProps)(CardTitle);
