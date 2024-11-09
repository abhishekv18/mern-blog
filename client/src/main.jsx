import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store,persistor } from './redux/store.js'
import {Provider} from 'react-redux'
import ThemeProvider from './components/ThemeProvider.jsx'
import { PersistGate } from 'redux-persist/integration/react'
createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
 <Provider store={store}>
   <ThemeProvider>
   <App />
   </ThemeProvider>
  </Provider>
  </PersistGate>
 
)
