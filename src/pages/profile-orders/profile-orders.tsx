import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/user-orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((s) => s.userOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
    const id = setInterval(() => dispatch(fetchUserOrders()), 5000);
    return () => clearInterval(id);
  }, [dispatch]);

  if (isLoading && orders.length === 0) return <Preloader />;

  return <ProfileOrdersUI orders={orders} />;
};
