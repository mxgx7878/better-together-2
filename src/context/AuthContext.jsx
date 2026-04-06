import { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser, switchUserProfile } from '../store/actions/authAction';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, currentProfile, availableProfiles, loading, error } = useSelector(
    (state) => state.auth
  );

  const switchProfile = (profileKey) => {
    dispatch(switchUserProfile(profileKey));
  };

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = () => {
    return dispatch(logoutUser());
  };

  const isProvider = user?.role === 'provider';
  const isParticipant = user?.role === 'participant';
  const isFree = user?.tier === 'free';
  const isPaid = user?.tier === 'paid';

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
