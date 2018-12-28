import produce from 'immer'
import {
  CHANGE_BOARD_TITLE,
  DELETE_BOARD,
  ADD_LIST_SUCCESS,
  GET_BOARD_SUCCESS,
  GET_LIST_REQUEST,
  ADD_BOARD_REQUEST,
  ADD_BOARD_SUCCESS,
  MESSAGE_FAILURE,
  DELETE_BOARD_SUCCESS,
  DELETE_LIST_FAILURE,
  DELETE_BOARD_REQUEST,
  UPDATE_CURRENT_BOARD_ID,
  GET_BOARD_REQUEST,
  DELETE_LIST_SUCCESS,
  MOVE_LIST_SUCCESS,
  MOVE_LIST_REQUEST
} from '../actions/actionTypes'

const initState = {
  loading: true,
  byId: {}
};

const boardReducer = (state = initState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_LIST_SUCCESS: {
        const { boardId, list } = action.payload;
        draft.byId[boardId].lists = [...draft.byId[boardId].lists, list._id]
        break;
      }
      case MOVE_LIST_REQUEST: {
        // draft.loading = true;
        break;
      }
      case MOVE_LIST_SUCCESS: {
        draft.loading = false;
        const { oldListIndex, newListIndex, boardId } = action.payload;
        let newLists = [...draft.byId[boardId].lists];
        const [removedList] = newLists.splice(oldListIndex, 1);
        newLists.splice(newListIndex, 0, removedList);
        draft.byId[boardId].lists = newLists;
        break;
      }
      case DELETE_LIST_SUCCESS: {
        const { listId, boardId } = action.payload;
        const newLists = draft.byId[boardId].lists.filter(id => id !== listId);
        draft.byId[boardId] = {
          ...draft.byId[boardId],
          lists: newLists
        }
        break;
      }
      case MESSAGE_FAILURE: {
        draft.loading = false;
        break;
      }
      case GET_BOARD_REQUEST: {
        draft.loading = true;
        break;
      }
      case GET_BOARD_SUCCESS: {
        draft.loading = false;
        action.payload.forEach(board => {
          draft.byId[board._id] = board
        })
        break
      }
      case UPDATE_CURRENT_BOARD_ID: {
        draft.boardId = action.payload;
        break;
      }
      case ADD_BOARD_REQUEST: {
        draft.loading = true;
        break;
      }
      case ADD_BOARD_SUCCESS: {
        draft.loading = false;
        const { _id } = action.payload
        draft.byId[_id] = action.payload
        break
      }
      case CHANGE_BOARD_TITLE: {
        const { _id, title } = action.payload;
        draft.byId[_id] = { ...draft.byId[_id], title };
        break;
      }
      case DELETE_BOARD_REQUEST: {
        draft.loading = true
        break
      }
      case DELETE_BOARD_SUCCESS: {
        const id = action.payload
        const { [id]: deleted, ...rest } = draft.byId;
        draft.byId = rest;
        break;
      }
      default:
        return draft
    }
  })


export default boardReducer;