export const environment = {
  production: true,
  apiUrl: window.location.origin.includes('localhost') 
    ? 'http://localhost:5000/api' 
    : 'https://taskmanager-fullstack-production.up.railway.app/api'
};
