import { Navigate, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';

type Props = {
  children: ReactElement;
  onlyUnAuth?: boolean; // Доступ только НЕавторизованным пользователям
  redirectTo?: string; // Куда редиректить при нарушении доступа
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
  redirectTo,
}: Props) => {
  const location = useLocation();

  // Временная логика авторизации
  const isAuth = Boolean(localStorage.getItem('token'));
  const isAuthChecked = true;

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
