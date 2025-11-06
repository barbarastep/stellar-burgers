import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { registerUser } from '../../services/slices/user-slice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  type LocationState = { from?: Location } | null;
  const from = (location.state as LocationState)?.from?.pathname ?? '/';

  const errorText = useSelector((s) => s.user.error);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userName || !email || !password) return;

    await dispatch(registerUser({ name: userName, email, password }));
    navigate(from, { replace: true });
  };

  return (
    <RegisterUI
      errorText={errorText || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
