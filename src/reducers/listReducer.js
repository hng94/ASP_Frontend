import produce from 'immer';
import { ADD_LIST_SUCCESS, GET_LIST_SUCCESS, CHANGE_LIST_TITLE_REQUEST, CHANGE_LIST_TITLE_SUCCESS, DELETE_LIST_REQUEST, DELETE_LIST_SUCCESS, MOVE_CARD_SUCCESS, DELETE_CARD_SUCCESS, ADD_CARD_SUCCESS } from '../actions/actionTypes';

const initState = {
  loading: true,
  byId: {}
}

const listReducer = (state = initState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ADD_CARD_SUCCESS: {
        const { listId, card } = action.payload;
        const cardId = card._id;
        draft.byId[listId].cards = [...draft.byId[listId].cards, cardId]
        break;
      }
      case MOVE_CARD_SUCCESS: {
        const {
          oldCardIndex,
          newCardIndex,
          sourceListId,
          destListId
        } = action.payload;
        // Move within the same list
        if (sourceListId === destListId) {
          const newCards = Array.from(state.byId[sourceListId].cards);
          const [removedCard] = newCards.splice(oldCardIndex, 1);
          newCards.splice(newCardIndex, 0, removedCard);
          draft.byId[sourceListId].cards = newCards;
        }
        // Move card from one list to another
        else {
          const sourceCards = Array.from(state.byId[sourceListId].cards);
          const [removedCard] = sourceCards.splice(oldCardIndex, 1);
          const destinationCards = Array.from(state.byId[destListId].cards);
          destinationCards.splice(newCardIndex, 0, removedCard);
          draft.byId[sourceListId].cards = sourceCards;
          draft.byId[destListId].cards = destinationCards;
        }
        break;
      }
      case DELETE_CARD_SUCCESS: {
        const { cardId, listId } = action.payload;
        draft.byId[listId].cards = draft.byId[listId].cards.filter(id => id !== cardId);
        break;
      }
      case ADD_LIST_SUCCESS: {
        const { list } = action.payload;
        draft.byId[list._id] = list;
        break;
      }
      case GET_LIST_SUCCESS: {
        draft.loading = false;
        action.payload.forEach(list => {
          draft.byId[list._id] = list;
        });
        break;
      }
      case CHANGE_LIST_TITLE_REQUEST: {
        // draft.loading = true;
        break;
      }
      case CHANGE_LIST_TITLE_SUCCESS: {
        draft.loading = false;
        const { _id, title } = action.payload;
        draft.byId[_id] = { ...draft.byId[_id], title };
        break;
      }
      case DELETE_LIST_REQUEST: {
        // draft.loading = true;
        break;
      }
      case DELETE_LIST_SUCCESS: {
        draft.loading = false;
        const { listId } = action.payload;
        const { [listId]: deleted, ...rest } = draft.byId;
        draft.byId = rest;
        break;
        // const { [listId]: deletedList, ...restOfLists } = state;
        // return restOfLists;
      }
      default:
        return state;
    }
  })


export default listReducer;
