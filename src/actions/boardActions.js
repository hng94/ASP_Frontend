import axios from 'axios';

import {
  GET_BOARD_REQUEST,
  GET_BOARD_FAILURE,
  GET_BOARD_SUCCESS,
  ADD_BOARD_REQUEST,
  ADD_BOARD_SUCCESS,
  ADD_BOARD_FAILURE,
  CHANGE_BOARD_TITLE,
  DELETE_BOARD_SUCCESS,
  MESSAGE_FAILURE,
  GET_LIST_REQUEST,
  GET_CARD_REQUEST,
  GET_LIST_SUCCESS,
  GET_CARD_SUCCESS,
} from './actionTypes';

const baseURL = 'http://localhost:4000/api'
const userId = '5c0d0228654ec309cc2314ff'

function get() {
  return async dispatch => {
    dispatch({
      type: GET_BOARD_REQUEST
    })
    try {
      const { data } = await axios.get(`${baseURL}/boards/${userId}`);
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

function getById(boardId) {
  return async dispatch => {
    dispatch({
      type: GET_BOARD_REQUEST
    });
    dispatch({
      type: GET_LIST_REQUEST
    });
    dispatch({
      type: GET_CARD_REQUEST
    });
    try {
      const { data } = await axios.get(`${baseURL}/boards/${userId}/byId/${boardId}`);
      const { board, lists, cards } = data;
      dispatch({
        type: GET_BOARD_SUCCESS,
        payload: [board],
      })
      dispatch({
        type: GET_LIST_SUCCESS,
        payload: lists,
      })
      dispatch({
        type: GET_CARD_SUCCESS,
        payload: cards,
      })
    } catch (error) {
      dispatch({
        type: GET_BOARD_FAILURE,
        payload: error.toString()
      })
    }
  }
}

function createBoard(board) {
  return async (dispatch) => {
    board.users = [userId]
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

function deleteBoard(_id) {
  return async dispatch => {
    try {
      const { data } = await axios.delete(`${baseURL}/boards/${_id}`);
      dispatch({
        type: DELETE_BOARD_SUCCESS,
        payload: _id
      })
    } catch (error) {
      dispatch({
        type: MESSAGE_FAILURE,
        payload: error
      })
    }
    finally {
      // window.location.href = '/';
    }
  }
}

function changeTitle(board) {
  return async dispatch => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      };
      const { _id } = board;
      const { data } = await axios.put(`${baseURL}/boards/changeBoardTitle`, board);
      dispatch({
        type: CHANGE_BOARD_TITLE,
        payload: data
      })
    } catch (error) {

    }
  }
}

export const boardActions = {
  get,
  getById,
  createBoard,
  deleteBoard,
  changeTitle
}
