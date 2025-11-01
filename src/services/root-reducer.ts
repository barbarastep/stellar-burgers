import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { userReducer } from './slices/user-slice';
import { burgerConstructorReducer } from './slices/constructor-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: burgerConstructorReducer
});

export type RootState = ReturnType<typeof rootReducer>;
