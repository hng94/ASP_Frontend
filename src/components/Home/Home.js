/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Header from '../Header/Header'
import BoardAdder from './BoardAdder'
import './Home.scss'
import { boardActions } from '../../actions/boardActions'

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
    const { dispatch } = this.props
    dispatch(boardActions.get())
  }

  render() {
    const { loading, boards, history } = this.props;
    return (
      <>
        <Header />
        <div className="home">
          <div className="main-content">
            <h1>Boards</h1>
            {loading && <p>Fetching boards</p>}
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
  boards: Object.values(state.boards.byId)
})

export default connect(mapStateToProps)(Home)
