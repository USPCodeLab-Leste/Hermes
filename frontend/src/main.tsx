import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './styles/global.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { MotionProvider } from './contexts/MotionContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <MotionProvider>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </MotionProvider>
)
