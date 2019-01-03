import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import ClickOutside from "../ClickOutside/ClickOutside";
import "./CardAdder.scss";
import {cardActions} from '../../actions/cardActions';
import { Button, Icon } from "antd";

class CardAdder extends Component {
  static propTypes = {
    listId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      newText: "",
      isOpen: false
    };
  }

  // componentWillUnmount() {
  //   const { socket } = this.props;
  //   socket.disconnect();
  // }
  
  toggleCardComposer = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleChange = event => {
    this.setState({ newText: event.target.value });
  };

  handleKeyDown = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      this.handleSubmit(event);
    } else if (event.keyCode === 27) {
      this.toggleCardComposer();
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { newText } = this.state;
    const { listId, dispatch, socket, boardId } = this.props;
    if (newText === "") return;
    const data = { cardTitle: newText,  listId, boardId };
    dispatch(cardActions.addCardRequest(socket, data))
    this.toggleCardComposer();
    this.setState({ newText: "" });
  };

  render() {
    const { newText, isOpen } = this.state;
    return isOpen ? (
      <ClickOutside handleClickOutside={this.toggleCardComposer}>
        <form
          onSubmit={this.handleSubmit}
          className="card-adder-textarea-wrapper"
        >
          <Textarea
            autoFocus
            useCacheForDOMMeasurements
            minRows={1}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            value={newText}
            className="card-adder-textarea"
            placeholder="Add a new card..."
            spellCheck={false}
            onBlur={this.toggleCardComposer}
          />
        </form>
      </ClickOutside>
    ) : (
      <Button type="primary" onClick={this.toggleCardComposer} className="add-card-button">
        <Icon type="plus"/>
      </Button>
    );
  }
}

const mapStateToProps = (state) => ({
  socket: state.socket,
  boardId: state.boards.boardId
});

export default connect(mapStateToProps)(CardAdder);
