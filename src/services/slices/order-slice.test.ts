import {
  orderReducer,
  initialState,
  placeOrder,
  fetchOrderByNumber,
  clearOrder
} from './order-slice';
import { TOrder } from '../../utils/types';

const mockOrder: TOrder = {
  _id: 'order-id-1',
  status: 'done',
  name: 'Test order',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
};

describe('orderSlice reducer', () => {
  it('возвращает initialState для неизвестного экшена', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('обрабатывает clearOrder', () => {
    const prevState = {
      currentOrder: mockOrder,
      isRequest: true,
      error: 'Some error'
    };

    const state = orderReducer(prevState, clearOrder());

    expect(state.currentOrder).toBeNull();
    expect(state.error).toBeNull();
    expect(state.isRequest).toBe(true);
  });

  it('обрабатывает placeOrder.pending', () => {
    const state = orderReducer(initialState, { type: placeOrder.pending.type });

    expect(state.isRequest).toBe(true);
    expect(state.error).toBeNull();
    expect(state.currentOrder).toBeNull();
  });

  it('обрабатывает placeOrder.fulfilled', () => {
    const action = {
      type: placeOrder.fulfilled.type,
      payload: mockOrder
    };

    const state = orderReducer(initialState, action);

    expect(state.isRequest).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('обрабатывает placeOrder.rejected с payload', () => {
    const prevState = { ...initialState, isRequest: true };
    const action = {
      type: placeOrder.rejected.type,
      payload: 'Order failed by test',
      error: { message: 'Ignored' }
    };

    const state = orderReducer(prevState, action);

    expect(state.isRequest).toBe(false);
    expect(state.error).toBe('Order failed by test');
  });

  it('обрабатывает placeOrder.rejected без payload', () => {
    const prevState = { ...initialState, isRequest: true };
    const action = {
      type: placeOrder.rejected.type,
      payload: undefined,
      error: { message: 'Order failed (error.message)' }
    };

    const state = orderReducer(prevState, action);

    expect(state.isRequest).toBe(false);
    expect(state.error).toBe('Order failed (error.message)');
  });

  it('обрабатывает fetchOrderByNumber.pending', () => {
    const state = orderReducer(
      { ...initialState, currentOrder: mockOrder, error: 'Old error' },
      { type: fetchOrderByNumber.pending.type }
    );

    expect(state.isRequest).toBe(true);
    expect(state.error).toBeNull();
    expect(state.currentOrder).toBeNull();
  });

  it('обрабатывает fetchOrderByNumber.fulfilled', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    };

    const state = orderReducer(initialState, action);

    expect(state.isRequest).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchOrderByNumber.rejected с payload', () => {
    const prevState = { ...initialState, isRequest: true };
    const action = {
      type: fetchOrderByNumber.rejected.type,
      payload: 'Order load failed',
      error: { message: 'Ignored' }
    };

    const state = orderReducer(prevState, action);

    expect(state.isRequest).toBe(false);
    expect(state.error).toBe('Order load failed');
  });

  it('обрабатывает fetchOrderByNumber.rejected без payload', () => {
    const prevState = { ...initialState, isRequest: true };
    const action = {
      type: fetchOrderByNumber.rejected.type,
      payload: undefined,
      error: { message: 'Order load failed (error.message)' }
    };

    const state = orderReducer(prevState, action);

    expect(state.isRequest).toBe(false);
    expect(state.error).toBe('Order load failed (error.message)');
  });
});
