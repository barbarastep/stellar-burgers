import React, { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

const defaultLinks = [
  { to: '/', label: 'Конструктор' },
  { to: '/feed', label: 'Лента заказов' },
  { to: '/profile', label: 'Личный кабинет' }
];

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  navLinks = defaultLinks
}) => {
  const [constructorLink, feedLink, profileLink] = navLinks;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to={constructorLink.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type='primary' />
            <p className='text text_type_main-default ml-2 mr-10'>
              {constructorLink.label}
            </p>
          </NavLink>

          <NavLink
            to={feedLink.to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type='primary' />
            <p className='text text_type_main-default ml-2'>{feedLink.label}</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Logo className='' />
        </div>

        <NavLink
          to={profileLink.to}
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          <ProfileIcon type='primary' />
          <p className='text text_type_main-default ml-2'>
            {userName || profileLink.label}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
