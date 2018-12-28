import axios from 'axios';

const baseURL = 'http://localhost:4000/api/boards';
const userId = '5c0d0228654ec309cc2314ff';

function create(board) {
  board.users = [userId];
  const requestOptions = {
    headers: { 'Content-Type': 'application/json' },
  };

  return axios.post(`${baseURL}/`, board, requestOptions)
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}

function getByUserId() {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };

  return axios.get(`${baseURL}/byUserId/${userId}`, requestOptions)
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}

function getBoardById(boardId) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  return fetch(`${baseURL}/boards?boardID=${boardId}`, requestOptions)
    .then(handleResponse)
    .then((data) => {
      const board = data[0];
      return board;
    });
}

function handleResponse(response) {
  return response.data().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        // logout();
        // window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

export const boardService = {
    getByUserId,
    getBoardById,
    create,
  };
