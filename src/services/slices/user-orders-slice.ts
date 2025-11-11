import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type State = { orders: TOrder[]; isLoading: boolean; error: string | null };
const initialState: State = { orders: [], isLoading: false, error: null };

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('userOrders/fetch', async (_, { rejectWithValue }) => {
  try {
    const orders = await getOrdersApi();
    return orders;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to load user orders';
    return rejectWithValue(msg);
  }
});

const slice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUserOrders.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    b.addCase(fetchUserOrders.fulfilled, (s, a) => {
      s.isLoading = false;
      s.orders = a.payload;
    });
    b.addCase(fetchUserOrders.rejected, (s, a) => {
      s.isLoading = false;
      s.error = a.payload ?? a.error.message ?? 'Failed';
    });
  }
});

export const userOrdersReducer = slice.reducer;
