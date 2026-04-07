import api from './api';

const eventsService = {
  getAll: async () => {
    return api.get('/events');
  },

  getById: async (id) => {
    return api.get(`/events/${id}`);
  },

  rsvp: async (eventId) => {
    return api.post(`/events/${eventId}/rsvp`);
  },

  cancelRsvp: async (eventId) => {
    return api.delete(`/events/${eventId}/rsvp`);
  },
};

export default eventsService;
