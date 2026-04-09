import { useSelector, useDispatch } from 'react-redux';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsProvider,
  selectIsParticipant,
  selectIsAdmin,
  selectIsFree,
  selectIsPaid,
  selectAuthLoading,
  selectDummyUsers,
  switchProfile,
} from '../store/slices/authSlice';
import { logoutUser } from '../store/actions/authActions';

// Redux-based useAuth hook — same API as the old Context-based one
// so existing pages work with minimal import path changes
const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isProvider = useSelector(selectIsProvider);
  const isParticipant = useSelector(selectIsParticipant);
  const isAdmin = useSelector(selectIsAdmin);
  const isFree = useSelector(selectIsFree);
  const isPaid = useSelector(selectIsPaid);
  const loading = useSelector(selectAuthLoading);
  const dummyUsers = useSelector(selectDummyUsers);

  const currentProfile = user?.email || '';
  const availableProfiles = Object.keys(dummyUsers);

  const login = () => {}; // Use loginUser thunk instead
  const logout = () => dispatch(logoutUser());
  const handleSwitchProfile = (email) => dispatch(switchProfile(email));

  return {
    user,
    isAuthenticated,
    currentProfile,
    switchProfile: handleSwitchProfile,
    login,
    logout,
    isProvider,
    isParticipant,
    isAdmin,
    isFree,
    isPaid,
    loading,
    availableProfiles,
  };
};

export { useAuth };
export default useAuth;
