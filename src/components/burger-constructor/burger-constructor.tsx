import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  moveIngredient,
  removeIngredient
} from '../../services/slices/constructor-slice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector((s) => s.burgerConstructor);
  const isAuth = useSelector((s) => Boolean(s.user.data));

  const orderRequest = false; // TODO: сделать реальным
  const orderModalData = null; // TODO: сделать реальным

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingPrice = ingredients.reduce((sum, v) => sum + v.price, 0);
    return bunPrice + ingPrice;
  }, [bun, ingredients]);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!bun || orderRequest) return;
    // TODO: логика оформления/открытия модалки
  };

  const closeOrderModal = () => {};

  // перемещение/удаление
  const onItemMoveUp = (index: number) =>
    index > 0 && dispatch(moveIngredient({ from: index, to: index - 1 }));

  const onItemMoveDown = (index: number) =>
    index < ingredients.length - 1 &&
    dispatch(moveIngredient({ from: index, to: index + 1 }));

  const onItemRemove = (id: string) => dispatch(removeIngredient(id));

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      onItemMoveUp={onItemMoveUp}
      onItemMoveDown={onItemMoveDown}
      onItemRemove={onItemRemove}
    />
  );
};
