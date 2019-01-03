import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./BoardDeleter.scss";
import { boardActions } from "../../actions/boardActions";
import { Button, Icon, Modal } from "antd";

const confirm = Modal.confirm;

class BoardDeleter extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({ boardId: PropTypes.string })
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  handleSelection = () => {
    const { dispatch, match, user, socket } = this.props;
    const { boardId } = match.params;
    confirm({
      title: 'Are you sure to delete this board?',
      content: 'Deleted boards can not be restored.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(boardActions.deleteBoard(socket, user.email, boardId));
      },
      onCancel() {
      },
    })
  };

  render() {
    const { board, user } = this.props;
    return (
      <>
        {(board.owner === user.email) &&
          <Button type="danger" onClick={this.handleSelection}>
            <Icon type="delete"/> Delete board
          </Button>
        }
      </>
    )
  }
}

const mapStateToProps = state => {
  const { boardId } = state.boards;
  return {
    user: state.user,
    board: state.boards.byId[boardId],
    socket: state.socket
  }
}

export default withRouter(connect(mapStateToProps)(BoardDeleter));
