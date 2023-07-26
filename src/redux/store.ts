import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension'
import cardInfoReducer from './cardInfoReducer'
import currentCardReducer from './currentCardReducer'


const rootReducer = combineReducers({
  cardInfo: cardInfoReducer,
  curentCard: currentCardReducer
})

export type StoreState = ReturnType<typeof rootReducer>


export const store = createStore(rootReducer, composeWithDevTools())