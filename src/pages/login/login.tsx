import { useLocation, useNavigate, Location } from 'react-router-dom';
import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/user-slice';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  type LocationState = { from?: Location } | null;
  const from = (location.state as LocationState)?.from?.pathname ?? '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate(from, { replace: true });
    } catch {}
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
