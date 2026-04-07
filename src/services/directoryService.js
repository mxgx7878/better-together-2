import api from './api';

const directoryService = {
  search: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/directory?${params}`);
  },

  getProvider: async (id) => {
    return api.get(`/directory/${id}`);
  },
};

export default directoryService;
