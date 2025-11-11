import { FC } from 'react';
import { useSelector } from '../../services/store';
import { NavLink } from 'react-router-dom';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const userName = useSelector((s) => s.user.data?.name ?? '');

  const navLinks = [
    { to: '/', label: 'Конструктор' },
    { to: '/feed', label: 'Лента заказов' },
    { to: '/profile', label: 'Личный кабинет' }
  ];

  return <AppHeaderUI userName={userName} navLinks={navLinks} />;
};
