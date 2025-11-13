import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import {
  loginUserApi,
  getUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export type LoginPayload = { email: string; password: string };

type UserState = {
  data: TUser | null;
  isAuthChecked: boolean; // проверка токенов / пользователя на старте
  isLoading: boolean;
  error: string | null;
};

export const initialState: UserState = {
  data: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const initAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: null }
>('user/initAuth', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch {
    return rejectWithValue(null); // нет токена / нужно повторно залогиниться
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  LoginPayload,
  { rejectValue: string }
>('user/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(payload);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Login failed';
    return rejectWithValue(msg);
  }
});

export const logoutUser = createAsyncThunk<void>('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(payload);
    setCookie('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Register failed';
    return rejectWithValue(msg);
  }
});

// обновление данных пользователя
export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (payload, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(payload); // { success, user }
    return res.user;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Update failed';
    return rejectWithValue(msg);
  }
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
    b.addCase(initAuth.fulfilled, (s, a) => {
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
    b.addCase(loginUser.fulfilled, (s, a) => {
      s.isLoading = false;
      s.data = a.payload;
      s.isAuthChecked = true;
    });
    b.addCase(loginUser.rejected, (s, a) => {
      s.isLoading = false;
      s.error = a.payload ?? a.error.message ?? 'Login failed';
    });

    // logout
    b.addCase(logoutUser.fulfilled, (s) => {
      s.data = null;
    });

    // register
    b.addCase(registerUser.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    b.addCase(registerUser.fulfilled, (s, a) => {
      s.isLoading = false;
      s.data = a.payload;
      s.isAuthChecked = true;
    });
    b.addCase(registerUser.rejected, (s, a) => {
      s.isLoading = false;
      s.error = a.payload ?? a.error.message ?? 'Register failed';
    });

    // update
    b.addCase(updateUser.pending, (s) => {
      s.isLoading = true;
      s.error = null;
    });
    b.addCase(updateUser.fulfilled, (s, a) => {
      s.isLoading = false;
      s.data = a.payload;
    });
    b.addCase(updateUser.rejected, (s, a) => {
      s.isLoading = false;
      s.error = a.payload ?? a.error.message ?? 'Update failed';
    });
  }
});

export const userReducer = userSlice.reducer;
