import {
  burgerConstructorReducer,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  initialState as constructorInitialState
} from './constructor-slice';
import type { TIngredient } from '../../utils/types';

describe('constructor-slice reducer', () => {
  const bun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const filling1: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const filling2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093f',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'https://code.s3.yandex.net/react/code/meat-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
  };

  it('добавляет булку через setBun (id генерируется prepare)', () => {
    const state1 = burgerConstructorReducer(constructorInitialState, setBun(bun));
    expect(state1.bun).toBeTruthy();
    expect(state1.bun?.name).toBe(bun.name);
    expect(state1.bun?.id).toBeDefined();
  });

  it('добавляет ингредиент через addIngredient (id генерируется prepare)', () => {
    const state1 = burgerConstructorReducer(constructorInitialState, addIngredient(filling1));
    expect(state1.ingredients).toHaveLength(1);
    expect(state1.ingredients[0].name).toBe(filling1.name);
    expect(state1.ingredients[0].id).toBeDefined();
  });

  it('удаляет ингредиент по id', () => {
    const state1 = burgerConstructorReducer(constructorInitialState, addIngredient(filling1));
    const addedId = state1.ingredients[0].id;
    const state2 = burgerConstructorReducer(state1, removeIngredient(addedId));
    expect(state2.ingredients).toHaveLength(0);
  });

  it('меняет порядок ингредиентов (moveIngredient)', () => {
    const s1 = burgerConstructorReducer(constructorInitialState, addIngredient(filling1));
    const s2 = burgerConstructorReducer(s1, addIngredient(filling2));
    const s3 = burgerConstructorReducer(s2, moveIngredient({ from: 0, to: 1 }));
    expect(s3.ingredients.map((i) => i.name)).toEqual([filling2.name, filling1.name]);
  });

  it('очищает конструктор', () => {
    const s1 = burgerConstructorReducer(constructorInitialState, setBun(bun));
    const s2 = burgerConstructorReducer(s1, addIngredient(filling1));
    const cleared = burgerConstructorReducer(s2, clearConstructor());
    expect(cleared).toEqual(constructorInitialState);
  });
});
