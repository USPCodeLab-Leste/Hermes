import { Outlet } from 'react-router-dom'
import AppFooter from '../components/AppFooter'

export default function AppLayout() {
  return (
    <>
      <Outlet />
      <AppFooter />
    </>
  )
}