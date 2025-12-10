// Use environment variables for API URLs
// Development: http://localhost:4005
// Production: your domain or server IP
const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4005'
const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:4005'
const themeDefault = 'dark'
const namesOfModes = ['dark', 'moonlight', 'eclipse', 'light']

export { baseUrl, serverUrl, themeDefault, namesOfModes }
