import { Outlet } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import AppFooter from '../components/AppFooter'

export default function AppLayout() {
  return (
    <>
      <AppHeader />
      <main className='main-app p-4 my-0 mx-auto max-w-2xl w-9/10'>
        <Outlet />
      </main>
      <AppFooter />
    </>
  )
}