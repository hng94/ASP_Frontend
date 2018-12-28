import axios from 'axios';
import { GET_CARD_REQUEST, GET_CARD_SUCCESS, ADD_CARD_REQUEST, ADD_CARD_SUCCESS, CHANGE_CARD_TITLE_REQUEST, CHANGE_CARD_TITLE_SUCCESS, DELETE_CARD_REQUEST, DELETE_CARD_SUCCESS, MOVE_CARD_REQUEST, MOVE_CARD_SUCCESS } from './actionTypes';

const baseURL = 'http://localhost:4000/api';

function getCards(boardId) {
    return async dispatch => {
        dispatch({
            type: GET_CARD_REQUEST
        });
        try {
            const { data } = await axios.get(`${baseURL}/cards/${boardId}`);
            dispatch({
                type: GET_CARD_SUCCESS,
                payload: data
            })
        } catch (error) {
          console.error(error);
        }
    }
}

function addCardRequest(socket, data) {
    return dispatch => {
        dispatch({
            type: ADD_CARD_REQUEST
        })
        socket.emit(ADD_CARD_REQUEST, data);
    }
}

function addCardSuccess(data) {
    return {
        type: ADD_CARD_SUCCESS,
        payload: data
    }
}

function changeCardTitleRequest(socket, card) {
    return dispatch => {
        dispatch({
            type: CHANGE_CARD_TITLE_REQUEST
        })
        socket.emit(CHANGE_CARD_TITLE_REQUEST, card);
    }
}

function changeCardTitleSuccess(card) {
    return {
        type: CHANGE_CARD_TITLE_SUCCESS,
        payload: card
    }
}

function deleteCardRequest(socket, data) {
    return dispatch => {
        dispatch({
            type: DELETE_CARD_REQUEST
        })
        socket.emit(DELETE_CARD_REQUEST, data);
    }
}

function deleteCardSuccess(data) {
    return {
        type: DELETE_CARD_SUCCESS,
        payload: data
    }
}

function moveCardRequest(socket, data) {
    return dispatch => {
        dispatch({
            type: MOVE_CARD_REQUEST
        })
        socket.emit(MOVE_CARD_REQUEST, data);
    }
}

function moveCardSuccess(data) {
    return {
        type: MOVE_CARD_SUCCESS,
        payload: data
    }
}

export const cardActions = {
    getCards,
    addCardRequest,
    addCardSuccess,
    changeCardTitleRequest,
    changeCardTitleSuccess,
    deleteCardRequest,
    deleteCardSuccess,
    moveCardRequest,
    moveCardSuccess
}