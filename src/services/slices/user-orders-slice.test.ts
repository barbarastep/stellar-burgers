import {
  userOrdersReducer,
  initialState,
  fetchUserOrders
} from './user-orders-slice';
import { TOrder } from '../../utils/types';

const mockOrders: TOrder[] = [
  {
    _id: 'order-id-1',
    status: 'done',
    name: 'Test order 1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    number: 11111,
    ingredients: ['643d69a5c3f7b9001cfa093c']
  },
  {
    _id: 'order-id-2',
    status: 'pending',
    name: 'Test order 2',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    number: 22222,
    ingredients: ['643d69a5c3f7b9001cfa0941']
  }
];

describe('userOrdersSlice reducer', () => {
  it('возвращает initialState для неизвестного экшена', () => {
    const state = userOrdersReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('обрабатывает fetchUserOrders.pending', () => {
    const action = { type: fetchUserOrders.pending.type } as any;
    const state = userOrdersReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([]);
  });

  it('обрабатывает fetchUserOrders.fulfilled', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    } as any;

    const state = userOrdersReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockOrders);
  });

  it('обрабатывает fetchUserOrders.rejected с rejectValue', () => {
    const prevState = { ...initialState, isLoading: true };
    const action = {
      type: fetchUserOrders.rejected.type,
      payload: 'Failed to load',
      error: { message: 'Some error' }
    } as any;

    const state = userOrdersReducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Failed to load');
  });

  it('обрабатывает fetchUserOrders.rejected без payload', () => {
    const prevState = { ...initialState, isLoading: true };
    const action = {
      type: fetchUserOrders.rejected.type,
      payload: undefined,
      error: { message: 'Some error message' }
    } as any;

    const state = userOrdersReducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Some error message');
  });
});
