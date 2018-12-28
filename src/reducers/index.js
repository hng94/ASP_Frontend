import { combineReducers } from "redux";
import listReducer from "./listReducer";
import userReducer from "./userReducer";
import alert from "./alertReducer";
import boardReducer from "./boardReducer";
import cardReducer from "./cardReducer";
import socketReducer from "./socketReducer";

export default combineReducers({
  cards: cardReducer,
  lists: listReducer,
  boards: boardReducer,
  alert,
  user: userReducer,
  socket: socketReducer
  // currentBoardId
});
