import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import "./CardHeader.scss";
import { cardActions } from "../../actions/cardActions";
import {Icon, Modal} from 'antd';

const confirm = Modal.confirm;

class CardTitle extends Component {
  static propTypes = {
    cardTitle: PropTypes.string.isRequired,
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
    const { cardTitle, cardId, dispatch, socket, boardId } = this.props;
    if (newTitle === "") return;
    if (newTitle !== cardTitle) {
      const data = {
        _id: cardId,
        title: newTitle,
        boardId
      }
      dispatch(cardActions.changeCardTitleRequest(socket, data))
    }
    this.setState({ isOpen: false });
  };

  revertTitle = () => {
    this.setState({ newTitle: this.props.cardTitle, isOpen: false });
  };

  deletecard = () => {
    const { cardId, listId, dispatch, socket, boardId } = this.props;
    confirm({
      title: 'Are you sure to remove this card?',
      content: 'Removed cards can not be restored.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(cardActions.deleteCardRequest(socket, { listId, cardId, boardId }))
      }
    });
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
          <Icon type="close-circle" className="delete-card" onClick={this.deletecard}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  socket: state.socket,
  boardId: state.boards.boardId
});

export default connect(mapStateToProps)(CardTitle);
