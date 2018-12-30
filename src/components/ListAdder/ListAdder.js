import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import shortid from "shortid";
import "./ListAdder.scss";
import {listActions} from '../../actions/listActions'
import withRouter from 'react-router-dom';

class ListAdder extends Component {
  static propTypes = {
    boardId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      isOpen: false,
      listTitle: ""
    };
  }

  // componentWillMount() {
  //   const {dispatch, boardId} = this.props;
  //   dispatch(listActions.getList(boardId))
  // }

  // componentWillUnmount() {
  //   const { socket } = this.props;
  //   socket.disconnect();
  // }

  handleBlur = () => {
    this.setState({ isOpen: false });
  };
  handleChange = event => {
    this.setState({ listTitle: event.target.value });
  };
  handleKeyDown = event => {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.handleSubmit();
    } else if (event.keyCode === 27) {
      this.setState({ isOpen: false, listTitle: "" });
    }
  };
  handleSubmit = () => {
    const { dispatch, boardId, socket } = this.props;
    const { listTitle } = this.state;
    const listId = shortid.generate();
    if (listTitle === "") return;
    dispatch(listActions.addListRequest(socket, { boardId, listTitle }))
    this.setState({ isOpen: false, listTitle: "" });
  };
  render = () => {
    const { isOpen, listTitle } = this.state;
    if (!isOpen) {
      return (
        <button
          onClick={() => this.setState({ isOpen: true })}
          className="add-list-button"
        >
          Add a new list...
        </button>
      );
    }
    return (
      <div className="list">
        <Textarea
          autoFocus
          useCacheForDOMMeasurements
          value={listTitle}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          className="list-adder-textarea"
          onBlur={this.handleBlur}
          spellCheck={false}
        />
      </div>
    );
  };
}

const mapStateToProps = (state) => ({
  socket: state.socket
});

export default connect(mapStateToProps)(ListAdder);
