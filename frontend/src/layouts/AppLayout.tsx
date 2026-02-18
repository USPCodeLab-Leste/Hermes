import { Outlet } from 'react-router-dom'
import AppFooter from '../components/AppFooter'
import { SearchProvider } from '../contexts/SearchContext'

export default function AppLayout() {
  return (
    <SearchProvider>
      <Outlet />
      <AppFooter />
    </SearchProvider>
  )
}