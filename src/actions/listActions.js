import { ADD_LIST_REQUEST, ADD_LIST_SUCCESS, GET_LIST_REQUEST, GET_LIST_SUCCESS, GET_LIST_FAILURE, CHANGE_LIST_TITLE_REQUEST, CHANGE_LIST_TITLE_SUCCESS, DELETE_LIST_REQUEST, DELETE_LIST_SUCCESS, MOVE_LIST_REQUEST, MOVE_LIST_SUCCESS } from './actionTypes';
import axios from 'axios'

const baseURL = 'http://localhost:4000/api'

function getList(boardId) {
    return async dispatch => {
        dispatch({
            type: GET_LIST_REQUEST
        });
        try {
            const { data } = await axios.get(`${baseURL}/lists/${boardId}`);
            dispatch({
                type: GET_LIST_SUCCESS,
                payload: data
            })
        } catch (error) {
            dispatch({
                type: GET_LIST_FAILURE,
                payload: error.toString()
            })
        }
    }
}

function addListRequest(socket, data) {
    return dispatch => {
        dispatch({
            type: ADD_LIST_REQUEST
        })
        socket.emit(ADD_LIST_REQUEST, data);
    }
}

function addListSuccess(data) {
    return {
        type: ADD_LIST_SUCCESS,
        payload: data
    }
}

function changeListTitleRequest(socket, boardId, list) {
    return dispatch => {
        dispatch({
            type: CHANGE_LIST_TITLE_REQUEST
        })
        socket.emit(CHANGE_LIST_TITLE_REQUEST, {boardId, list});
    }
}

function changeListTitleSuccess(list) {
    return {
        type: CHANGE_LIST_TITLE_SUCCESS,
        payload: list
    }
}

function deleteListRequest(socket, data) {
    return dispatch => {
        dispatch({
            type: DELETE_LIST_REQUEST
        })
        socket.emit(DELETE_LIST_REQUEST, data);
    }
}

function deleteListSuccess(data) {
    return {
        type: DELETE_LIST_SUCCESS,
        payload: data
    }
}

function moveListRequest(socket, data) {
    return async dispatch => {
        dispatch({
            type: MOVE_LIST_REQUEST
        })
        socket.emit(MOVE_LIST_REQUEST, data);
    }
}

function moveListSuccess(data) {
    return {
        type: MOVE_LIST_SUCCESS,
        payload: data
    }
}

export const listActions = {
    getList,
    addListSuccess,
    addListRequest,
    changeListTitleRequest,
    changeListTitleSuccess,
    deleteListRequest,
    deleteListSuccess,
    moveListRequest,
    moveListSuccess,
}