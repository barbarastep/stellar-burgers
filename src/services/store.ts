import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { rootReducer, RootState as RootStateFromReducer } from './root-reducer';

//  временно:
// const initial = {
//   ingredients: { items: [], isLoading: false, error: null },
//   burgerConstructor: { bun: null, items: [] }
// };
// function rootReducer(state = initial, _action: any) {
//   return state;
// }

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = RootStateFromReducer;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
