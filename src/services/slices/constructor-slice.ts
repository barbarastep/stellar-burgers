import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.bun = action.payload;
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: { ...ingredient, id: nanoid() } as TConstructorIngredient
        };
      }
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        return {
          payload: { ...ingredient, id: nanoid() } as TConstructorIngredient
        };
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      // payload = id
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      )
        return;
      const item = state.ingredients.splice(from, 1)[0];
      state.ingredients.splice(to, 0, item);
    },
    clearConstructor() {
      return initialState;
    }
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export const burgerConstructorReducer = constructorSlice.reducer;
