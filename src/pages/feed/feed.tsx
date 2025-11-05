import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((s) => s.feed);
  const placedOrder = useSelector((s) => s.order.currentOrder);

  useEffect(() => {
    dispatch(fetchFeeds());
    const id = setInterval(() => dispatch(fetchFeeds()), 5000);
    return () => clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    if (placedOrder) dispatch(fetchFeeds());
  }, [dispatch, placedOrder]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
  );
};
