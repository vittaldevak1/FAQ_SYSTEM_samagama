import api from './axios';

export async function searchFAQs(query) {
  const { data } = await api.post('/search', { query });
  return data;
}

export async function getSuggestions(query) {
  const { data } = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
  return data;
}
