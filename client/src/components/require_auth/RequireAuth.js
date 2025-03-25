import { useLocation, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../../reducers/authReducer'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'

function RequireAuth() {
  const token = useSelector(selectCurrentToken)
  const location = useLocation()

  return token ? (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  ) : (
    <Navigate from={location.pathname} to="/signup" />
  )
}
export default RequireAuth
