/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Header from '../Header/Header'
import BoardAdder from './BoardAdder'
import './Home.scss'
import { boardActions } from '../../actions/boardActions'
import { UPDATE_MEMBER_SUCCESS, ADD_BOARD_SUCCESS, DELETE_BOARD_SUCCESS } from '../../actions/actionTypes';
import { Spin, notification } from 'antd';

class Home extends Component {
  // static propTypes = {
  //   boards: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       _id: PropTypes.string.isRequired,
  //       color: PropTypes.string.isRequired,
  //       title: PropTypes.string.isRequired
  //     }).isRequired
  //   ).isRequired,
  //   listsById: PropTypes.object.isRequired,
  //   history: PropTypes.object.isRequired
  // };

  componentWillMount() {
    const { dispatch, user, socket, boards } = this.props;
    console.log(boards);
    dispatch(boardActions.get(user.email));
    socket.on(UPDATE_MEMBER_SUCCESS, ({board, email}) => {
      const {pathname} = window.location;
      if (user.email !== email) return;
      if (board.users.includes(user.email)) {
        dispatch({
          type: ADD_BOARD_SUCCESS,
          payload: board
        });
        notification['info']({
          message: 'You got an invitation',
          description: <p>You are invited to board <strong>{board.title}</strong> by <strong>{board.owner}</strong></p>
        });
      }
      else {
        const params = pathname.split('/');
        if (params[1] === 'boards' && params[2] === board._id) {
          return;
        }
        
        notification['warning']({
          message: 'Attention',
          description: <p>You are removed from board <strong>{board.title}</strong></p>
        });
        console.log(boards);
        // dispatch({
        //   type: DELETE_BOARD_SUCCESS,
        //   payload: board._id
        // })
      }
    })
  }

  componentWillUnmount() {
    // this.props.socket.disconnect();
  }
  render() {
    const { loading, boards, history } = this.props;
    return (
      <>
        <Header />
        <div className="home">
          <div className="main-content">
            <h1>Boards</h1>
            {loading && <Spin/>}
            {!loading &&
              <div className="boards">
                {boards.map(board => (
                  <Link
                    key={board._id}
                    className={classnames('board-link', 'blue')}
                    to={`/boards/${board._id}/`}
                  >
                    <div className="board-link-title">{board.title}</div>
                  </Link>
                ))}
                <BoardAdder history={history} />
              </div>
            }
          </div>
        </div>
      </>
    )
  };
}

const mapStateToProps = state => ({
  loading: state.boards.loading,
  boards: Object.values(state.boards.byId),
  user: state.user,
  socket: state.socket
})

export default connect(mapStateToProps)(Home);
