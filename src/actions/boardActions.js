import axios from 'axios';
import { history } from '../helpers';

import {
  GET_BOARD_REQUEST,
  GET_BOARD_FAILURE,
  GET_BOARD_SUCCESS,
  ADD_BOARD_REQUEST,
  ADD_BOARD_SUCCESS,
  ADD_BOARD_FAILURE,
  CHANGE_BOARD_TITLE,
  GET_LIST_REQUEST,
  GET_CARD_REQUEST,
  GET_LIST_SUCCESS,
  GET_CARD_SUCCESS,
  REMOVE_MEMBER_REQUEST,
  ADD_MEMBER_REQUEST,
  DELETE_BOARD_REQUEST,
} from './actionTypes';
import { alertActions } from './alertActions';

const baseURL = 'http://localhost:4000/api';

function get(userEmail) {
  return async dispatch => {
    dispatch({
      type: GET_BOARD_REQUEST
    })
    try {
      const { data } = await axios.get(`${baseURL}/boards/${userEmail}`);
      dispatch({
        type: GET_BOARD_SUCCESS,
        payload: data
      })
    } catch (error) {
      dispatch({
        type: GET_BOARD_FAILURE,
        payload: error.toString()
      })
    }
  }
}

function getById(userEmail, boardId) {
  return async dispatch => {
    dispatch({
      type: GET_CARD_REQUEST
    });
    dispatch({
      type: GET_LIST_REQUEST
    });
    dispatch({
      type: GET_BOARD_REQUEST
    });
    try {
      const { data } = await axios.get(`${baseURL}/boards/${userEmail}/byId/${boardId}`);
      const { board, lists, cards } = data;
      dispatch({
        type: GET_CARD_SUCCESS,
        payload: cards,
      })
      dispatch({
        type: GET_LIST_SUCCESS,
        payload: lists,
      })
      dispatch({
        type: GET_BOARD_SUCCESS,
        payload: [board],
      })
    } catch (error) {
      dispatch(alertActions.error(error.toString()));
      history.push('/')
    }
  }
}

function createBoard(board) {
  return async (dispatch) => {
    dispatch({
      type: ADD_BOARD_REQUEST
    })

    try {
      const { data } = await axios.post(`${baseURL}/boards/`, board);
      dispatch({
        type: ADD_BOARD_SUCCESS,
        payload: data
      })
    } catch (error) {
      dispatch({
        type: ADD_BOARD_FAILURE,
        payload: error.toString()
      })
    }
  }
}

function deleteBoard(socket, email, _id) {
  return async dispatch => {
    // try {
    //   const { data } = await axios.put(`${baseURL}/boards/delete`, {_id, email});
    //   dispatch({
    //     type: DELETE_BOARD_SUCCESS,
    //     payload: _id
    //   })
    // } catch (error) {
    //   dispatch({
    //     type: MESSAGE_FAILURE,
    //     payload: error
    //   })
    // }
    dispatch({
      type: DELETE_BOARD_REQUEST
    })
    socket.emit(DELETE_BOARD_REQUEST, {email, _id})
  }
}

function changeTitle(req) {
  return async dispatch => {
    try {
      const { data } = await axios.put(`${baseURL}/boards/changeBoardTitle`, req);
      const board = data;
      dispatch({
        type: CHANGE_BOARD_TITLE,
        payload: board,
      })
    } catch (error) {
      dispatch(alertActions.error(error.toString()))
    }
  }
}

function addMember(socket, req) {
  return dispatch => {
    dispatch({
      type: ADD_MEMBER_REQUEST,
    })
    socket.emit(ADD_MEMBER_REQUEST, req);
  }
}

function removeMember(socket, req) {
  return dispatch => {
    dispatch({
      type: REMOVE_MEMBER_REQUEST,
    })
    socket.emit(REMOVE_MEMBER_REQUEST, req);
  }
}

export const boardActions = {
  get,
  getById,
  createBoard,
  deleteBoard,
  changeTitle,
  addMember,
  removeMember
}
