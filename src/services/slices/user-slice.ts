import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { loginUserApi, getUserApi, logoutApi } from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export type LoginPayload = { email: string; password: string };

type UserState = {
  data: TUser | null;
  isAuthChecked: boolean; // проверка токенов / пользователя на старте
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  data: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const initAuth = createAsyncThunk<TUser | null>(
  'user/initAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch {
      return rejectWithValue(null); // нет токена / нужно повторно залогиниться
    }
  }
);

export const loginUser = createAsyncThunk<TUser, LoginPayload>(
  'user/login',
  async (payload) => {
    const res = await loginUserApi(payload);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  }
);

export const logoutUser = createAsyncThunk<void>('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    // init
    b.addCase(initAuth.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    b.addCase(initAuth.fulfilled, (s, a: PayloadAction<TUser | null>) => {
      s.isLoading = false;
      s.data = a.payload;
      s.isAuthChecked = true;
    });
    b.addCase(initAuth.rejected, (s) => {
      s.isLoading = false;
      s.data = null;
      s.isAuthChecked = true;
    });

    // login
    b.addCase(loginUser.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    b.addCase(loginUser.fulfilled, (s, a: PayloadAction<TUser>) => {
      s.isLoading = false;
      s.data = a.payload;
      s.isAuthChecked = true;
    });
    b.addCase(loginUser.rejected, (s, a) => {
      s.isLoading = false;
      s.error = a.error.message || 'Login failed';
    });

    // logout
    b.addCase(logoutUser.fulfilled, (s) => {
      s.data = null;
    });
  }
});

export const userReducer = userSlice.reducer;
