import { feedReducer, initialState, fetchFeeds } from './feed-slice';
import { TOrder } from '../../utils/types';

const mockOrders: TOrder[] = [
  {
    _id: 'order-1',
    status: 'done',
    name: 'Test Order 1',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    number: 101,
    ingredients: []
  },
  {
    _id: 'order-2',
    status: 'pending',
    name: 'Test Order 2',
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z',
    number: 102,
    ingredients: []
  }
];

describe('feedSlice reducer', () => {
  it('возвращает initialState при неизвестном экшене', () => {
    const state = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  it('обрабатывает fetchFeeds.pending', () => {
    const state = feedReducer(initialState, { type: fetchFeeds.pending.type });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fetchFeeds.fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: {
        orders: mockOrders,
        total: 5000,
        totalToday: 50
      }
    };

    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(5000);
    expect(state.totalToday).toBe(50);
  });

  it('обрабатывает fetchFeeds.rejected', () => {
    const prevState = { ...initialState, isLoading: true };

    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Feed load failed' }
    };

    const state = feedReducer(prevState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Feed load failed');
  });

  it('обрабатывает fetchFeeds.rejected без error.message', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: {}
    };

    const state = feedReducer(initialState, action);

    expect(state.error).toBe('Failed to load feed');
  });
});
