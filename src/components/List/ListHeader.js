import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Textarea from "react-textarea-autosize";
import "./ListHeader.scss";
import { listActions } from "../../actions/listActions";
import { Icon, Modal, Button } from "antd";
const confirm = Modal.confirm;

class ListTitle extends Component {
  static propTypes = {
    listTitle: PropTypes.string.isRequired,
    listId: PropTypes.string.isRequired,
    boardId: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.string).isRequired,
    dragHandleProps: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      newTitle: props.listTitle
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
    const { listTitle, listId, dispatch, socket, boardId } = this.props;
    if (newTitle === "") return;
    if (newTitle !== listTitle) {
      const listToUpdate = {
        _id: listId,
        title: newTitle
      }
      dispatch(listActions.changeListTitleRequest(socket, boardId, listToUpdate))
    }
    this.setState({ isOpen: false });
  };

  revertTitle = () => {
    this.setState({ newTitle: this.props.listTitle, isOpen: false });
  };

  deleteList = () => {
    const { listId, boardId, dispatch, socket } = this.props;
    confirm({
      title: 'Are you sure to remove this list?',
      content: 'Removed lists can not be restored.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(listActions.deleteListRequest(socket, { boardId, listId }))
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
    const { dragHandleProps, listTitle } = this.props;
    return (
      <div className="list-header">
        {isOpen ? (
          <div className="list-title-textarea-wrapper">
            <Textarea
              autoFocus
              useCacheForDOMMeasurements
              value={newTitle}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown}
              className="list-title-textarea"
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
              className="list-title-button"
            >
              {listTitle}
            </div>
          )}
        <div className="delete-list-wrapper" >
          <Button shape="circle" type="danger" onClick={this.deleteList} >
            <Icon type="delete" />
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    socket: state.socket,
    boardId: state.boards.boardId
  }
}


export default connect(mapStateToProps)(ListTitle);
