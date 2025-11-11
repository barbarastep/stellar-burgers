import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type FeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<
  { orders: TOrder[]; total: number; totalToday: number },
  void
>('feed/fetchFeeds', async () => await getFeedsApi());

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFeeds.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    b.addCase(fetchFeeds.fulfilled, (s, a) => {
      s.isLoading = false;
      s.orders = a.payload.orders;
      s.total = a.payload.total;
      s.totalToday = a.payload.totalToday;
    });
    b.addCase(fetchFeeds.rejected, (s, a) => {
      s.isLoading = false;
      s.error = a.error.message ?? 'Failed to load feed';
    });
  }
});

export const feedReducer = feedSlice.reducer;
