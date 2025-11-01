import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { useSelector } from '../../services/store';

type Props = {
  children: ReactElement;
  onlyUnAuth?: boolean; // Доступ только НЕавторизованным пользователям
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
  redirectTo
}: Props) => {
  const location = useLocation();

  // Логика авторизации
  const isAuth = useSelector((s) => Boolean(s.user.data));
  const isAuthChecked = useSelector((s) => s.user.isAuthChecked);

  if (!isAuthChecked) {
    return null;
  }

  // Страницы, доступные только НЕавторизованным пользователям
  if (onlyUnAuth && isAuth) {
    return <Navigate to={redirectTo ?? '/profile'} replace />;
  }

  // Страницы, доступные только авторизованным пользователям
  if (!onlyUnAuth && !isAuth) {
    return (
      <Navigate
        to={redirectTo ?? '/login'}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};
