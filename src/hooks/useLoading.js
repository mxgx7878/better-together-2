import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFn, options = {}) => {
    const { successMessage, errorMessage } = options;
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn();
      if (successMessage) toast.success(successMessage);
      return result;
    } catch (err) {
      const message = errorMessage || err.message || 'Something went wrong';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute, setError };
};

export default useLoading;
