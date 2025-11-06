import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { clearConstructor } from './constructor-slice';
import { RootState } from '../store';

type OrderState = {
  currentOrder: TOrder | null;
  isRequest: boolean;
  error: string | null;
};

const initialState: OrderState = {
  currentOrder: null,
  isRequest: false,
  error: null
};

export const placeOrder = createAsyncThunk<TOrder, void, { state: RootState }>(
  'order/placeOrder',
  async (_, { getState, dispatch }) => {
    const { bun, ingredients } = getState().burgerConstructor;
    if (!bun) throw new Error('No bun selected');
    const ids = [bun._id, ...ingredients.map((i) => i._id), bun._id];
    const res = await orderBurgerApi(ids);
    dispatch(clearConstructor());
    return res.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (num) => {
    const res = await getOrderByNumberApi(num);
    const order = res.orders?.[0];
    if (!order) throw new Error('Order not found');
    return order;
  }
);

const slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder(state) {
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (b) => {
    b.addCase(placeOrder.pending, (s) => {
      s.isRequest = true;
      s.error = null;
      s.currentOrder = null;
    });
    b.addCase(placeOrder.fulfilled, (s, a: PayloadAction<TOrder>) => {
      s.isRequest = false;
      s.currentOrder = a.payload;
    });
    b.addCase(placeOrder.rejected, (s, a) => {
      s.isRequest = false;
      s.error = a.error.message || 'Order failed';
    });

    b.addCase(fetchOrderByNumber.pending, (s) => {
      s.isRequest = true;
      s.error = null;
      s.currentOrder = null;
    });
    b.addCase(fetchOrderByNumber.fulfilled, (s, a: PayloadAction<TOrder>) => {
      s.isRequest = false;
      s.currentOrder = a.payload;
    });
    b.addCase(fetchOrderByNumber.rejected, (s, a) => {
      s.isRequest = false;
      s.error = a.error.message || 'Order load failed';
    });
  }
});

export const { clearOrder } = slice.actions;
export const orderReducer = slice.reducer;
