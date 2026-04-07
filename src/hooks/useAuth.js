import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../store/actions/authAction';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, currentProfile, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = (credentials) => dispatch(loginUser(credentials));
  const logout = () => dispatch(logoutUser());

  const isProvider = user?.role === 'provider';
  const isParticipant = user?.role === 'participant';
  const isAdmin = user?.role === 'admin';
  const isFree = user?.tier === 'free';
  const isPaid = user?.tier === 'paid';

  return {
    user,
    isAuthenticated,
    currentProfile,
    login,
    logout,
    isProvider,
    isParticipant,
    isAdmin,
    isFree,
    isPaid,
    loading,
    error,
  };
};

export default useAuth;
