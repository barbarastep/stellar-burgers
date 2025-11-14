import { rootReducer } from './root-reducer';

describe('rootReducer', () => {
  it('должен вернуть корректный initial state', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });
});
