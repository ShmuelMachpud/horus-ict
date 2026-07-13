import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import './index.css'
// import App from './App.tsx'
import ThemeProvider from './global/styles/theme/provider/ThemeProvider'
import Router from './global/routes/router/Router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </BrowserRouter>,
)
