import {
  ingredientsReducer,
  fetchIngredients,
  initialState as ingredientsInitialState
} from './ingredients-slice';
import type { TIngredient } from '../../utils/types';

describe('ingredients-slice reducer', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 20,
      carbohydrates: 30,
      calories: 200,
      price: 100,
      image: '',
      image_mobile: '',
      image_large: ''
    }
  ];

  it('должен установить isLoading в true при fetchIngredients.pending', () => {
    const state = ingredientsReducer(ingredientsInitialState, {
      type: fetchIngredients.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранить данные при fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(ingredientsInitialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('должен установить ошибку при fetchIngredients.rejected', () => {
    const state = ingredientsReducer(ingredientsInitialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
