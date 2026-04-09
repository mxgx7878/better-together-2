import { useSelector } from 'react-redux';
import { selectIsAdmin, selectIsProvider } from '../store/slices/authSlice';

// Returns the base dashboard path for the current user's role
const useBasePath = () => {
  const isAdmin = useSelector(selectIsAdmin);
  const isProvider = useSelector(selectIsProvider);

  if (isAdmin) return '/admin';
  if (isProvider) return '/provider';
  return '/participant';
};

export default useBasePath;
