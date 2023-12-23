// const container = document.getElementById("root")
// const root = ReactDOM.createRoot(container);
// root.render(<App />)


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.css';  
import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';                     // core css                   // core css
import './App.css';
import './flags.css';
import App from './components/App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
  </StrictMode>
);