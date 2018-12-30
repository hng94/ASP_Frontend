import produce from 'immer'
import { ADD_CARD_SUCCESS, CHANGE_CARD_TITLE_SUCCESS, DELETE_CARD_SUCCESS, DELETE_LIST_SUCCESS, GET_CARD_SUCCESS, MOVE_CARD_SUCCESS, GET_CARD_REQUEST, MOVE_CARD_REQUEST } from '../actions/actionTypes';

const initState = {
  loading: true,
  byId: {}
}

const cardReducer = (state = initState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_CARD_REQUEST: {
        draft.loading = true;
        break;
      }
      case GET_CARD_SUCCESS: {
        draft.loading = false;
        action.payload.forEach(card => {
          draft.byId[card._id] = card;
        });
        break;
      }
      case ADD_CARD_SUCCESS: {
        const {card} = action.payload;
        draft.byId[card._id] = card;
        break;
      }
      case CHANGE_CARD_TITLE_SUCCESS: {
        draft.loading = false;
        const { _id, title } = action.payload;
        draft.byId[_id] = { ...draft.byId[_id], title };
        break;
      }
      case CHANGE_CARD_TITLE_SUCCESS: {
        const {_id, title} = action.payload;
        draft.byId[_id].title = {...draft.byId[_id].title, title};
        break;
      }
      // case "CHANGE_CARD_COLOR": {
      //   const { color, cardId } = action.payload;
      //   return { ...state, [cardId]: { ...state[cardId], color } };
      // }
      case DELETE_CARD_SUCCESS: {
        draft.loading = false;
        const { cardId } = action.payload;
        const { [cardId]: deletedCard, ...restOfCards } = draft.byId;
        draft.byId = restOfCards;
        break;
      }
      case MOVE_CARD_REQUEST: {
        draft.loading = true;
        break;
      }
      case MOVE_CARD_SUCCESS: {
        draft.loading = false;
        break;
      }
      // Find every card from the deleted list and remove it (actually unnecessary since they will be removed from db on next write anyway)
      // case DELETE_LIST_SUCCESS: {
      //   const { cards: cardIds } = action.payload;
      //   return Object.keys(state)
      //     .filter(cardId => !cardIds.includes(cardId))
      //     .reduce(
      //       (newState, cardId) => ({ ...newState, [cardId]: state[cardId] }),
      //       {}
      //     );
      // }
      default:
        return state;
    }
  })

export default cardReducer;
