import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, switchUserProfile } from '../store/actions/authAction';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, currentProfile, availableProfiles, loading, error } = useSelector(
    (state) => state.auth
  );

  const switchProfile = (profileKey) => dispatch(switchUserProfile(profileKey));
  const login = (credentials) => dispatch(loginUser(credentials));
  const logout = () => dispatch(logoutUser());

  const isProvider = user?.role === 'provider';
  const isParticipant = user?.role === 'participant';
  const isFree = user?.tier === 'free';
  const isPaid = user?.tier === 'paid';

  return {
    user,
    isAuthenticated,
    currentProfile,
    switchProfile,
    login,
    logout,
    isProvider,
    isParticipant,
    isFree,
    isPaid,
    availableProfiles,
    loading,
    error,
  };
};

export default useAuth;
