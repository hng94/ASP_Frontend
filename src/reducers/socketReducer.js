import io from 'socket.io-client';
const user = JSON.parse(localStorage.getItem('user')) || {};
const token = user.token;
const socket = io.connect("http://localhost:4000",{
  'query': 'token=' + token
});

const socketReducer = (state = socket, action) => {
  return state;
}

export default socketReducer;