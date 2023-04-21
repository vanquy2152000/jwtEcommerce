import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes"
import { getAccount } from "./service/authApi";
import { useDispatch } from "react-redux";
import { doGetAccountAction } from "./redux/account/accountSlice";
import './App.scss'
import './scss/custom-scrollbar.scss';

const App = () => {
  const dispatch = useDispatch()

  const fetchAccount = async () => {
    if (window.location.pathname === '/login' || window.location.pathname === '/register') return;
    const res = await getAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }
  useEffect(() => {
    fetchAccount()
  }, [])

  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
