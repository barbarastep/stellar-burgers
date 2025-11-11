import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients-slice';
import { userReducer } from './slices/user-slice';
import { burgerConstructorReducer } from './slices/constructor-slice';
import { feedReducer } from './slices/feed-slice';
import { orderReducer } from './slices/order-slice';
import { userOrdersReducer } from './slices/user-orders-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  user: userReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  order: orderReducer,
  userOrders: userOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
