import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './ingredients-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer
  // TODO: позже добавить user, constructor, feed, и тп
});

export type RootState = ReturnType<typeof rootReducer>;
