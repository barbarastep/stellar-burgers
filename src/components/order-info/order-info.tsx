import { FC, useMemo, useEffect } from 'react';
import { Location, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { fetchOrderByNumber } from '../../services/slices/order-slice';

type LocationState = { background?: Location; order?: TOrder };

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const orderFromState =
    (location.state as LocationState | null)?.order ?? null;
  const showNumber = Boolean(
    (location.state as LocationState | null)?.background
  );

  const dispatch = useDispatch();
  const orderData = useSelector((s) => s.order.currentOrder);
  const ingredients: TIngredient[] = useSelector((s) => s.ingredients.items);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  useEffect(() => {
    if (!orderFromState && number && !orderData) {
      const n = Number(number);
      if (!Number.isNaN(n)) {
        dispatch(fetchOrderByNumber(n));
      }
    }
  }, [dispatch, number, orderFromState, orderData]);

  const sourceOrder: TOrder | null = orderData ?? orderFromState;

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!sourceOrder || ingredients.length === 0) return null;

    const date = new Date(sourceOrder.createdAt);

    type TWithCount = TIngredient & { count: number };
    type TIngredientsWithCount = Record<string, TWithCount>;

    const ingredientsInfo =
      sourceOrder.ingredients.reduce<TIngredientsWithCount>(
        (acc: TIngredientsWithCount, itemId: string) => {
          if (!acc[itemId]) {
            const ingredient = ingredients.find((ing) => ing._id === itemId);
            if (ingredient) {
              acc[itemId] = { ...ingredient, count: 1 };
            }
          } else {
            acc[itemId].count++;
          }
          return acc;
        },
        {} as TIngredientsWithCount
      );

    const total = Object.values(ingredientsInfo).reduce<number>(
      (acc: number, item: TWithCount) => acc + item.price * item.count,
      0
    );

    return {
      ...sourceOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [sourceOrder, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} showNumber={showNumber} />;
};
