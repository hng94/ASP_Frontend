import io from 'socket.io-client';

const socket = io.connect("http://localhost:4000");

const socketReducer = (state = socket, action) => {
  return state;
}

export default socketReducer;