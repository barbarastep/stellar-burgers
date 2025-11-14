import {
  userReducer,
  initialState,
  initAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './user-slice';
import { TUser } from '../../utils/types';

const mockUser = {
  name: 'Test User',
  email: 'test@example.com'
} as TUser;

describe('userSlice reducer', () => {
  it('должен вернуть initialState для неизвестного экшена', () => {
    const state = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('обрабатывает initAuth.pending', () => {
    const action = { type: initAuth.pending.type } as any;
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает initAuth.fulfilled', () => {
    const action = {
      type: initAuth.fulfilled.type,
      payload: mockUser
    } as any;
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает initAuth.rejected', () => {
    const action = { type: initAuth.rejected.type } as any;
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает loginUser.pending', () => {
    const action = { type: loginUser.pending.type } as any;
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    } as any;
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает loginUser.rejected с текстом ошибки', () => {
    const prevState = { ...initialState, isLoading: true };
    const action = {
      type: loginUser.rejected.type,
      payload: 'Login failed message',
      error: { message: 'Error' }
    } as any;
    const state = userReducer(prevState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Login failed message');
  });

  it('обрабатывает logoutUser.fulfilled', () => {
    const loggedInState = { ...initialState, data: mockUser };
    const action = { type: logoutUser.fulfilled.type } as any;
    const state = userReducer(loggedInState, action);
    expect(state.data).toBeNull();
  });

  it('обрабатывает registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser
    } as any;
    const state = userReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('обрабатывает registerUser.rejected', () => {
    const prevState = { ...initialState, isLoading: true };
    const action = {
      type: registerUser.rejected.type,
      payload: 'Register failed message',
      error: { message: 'Error' }
    } as any;
    const state = userReducer(prevState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Register failed message');
  });

  it('обрабатывает updateUser.fulfilled', () => {
    const currentState = { ...initialState, data: mockUser, isLoading: true };
    const updatedUser = { ...mockUser, name: 'Updated Name' } as TUser;
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    } as any;
    const state = userReducer(currentState, action);
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(updatedUser);
  });

  it('обрабатывает updateUser.rejected', () => {
    const prevState = { ...initialState, isLoading: true };
    const action = {
      type: updateUser.rejected.type,
      payload: 'Update failed message',
      error: { message: 'Error' }
    } as any;
    const state = userReducer(prevState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Update failed message');
  });
});
