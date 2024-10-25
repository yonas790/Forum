import { useContext, useEffect } from 'react';
import './App.css';
import { UserContext } from './context/UserContext';
import axios from 'axios'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp';
import Home from './Pages/Home/Home';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'

function App() {
  const [userData, setUserData] = useContext(UserContext)

const logout = () => {
    setUserData({
      token: undefined,
      user: undefined
    })
  }

  const checkLoggedIn = async () => {
    let token = localStorage.getItem('auth-token')
    if (token === null) {
      localStorage.setItem('auth-token', '')
      token = ''
    } else {
      const userRes = await axios.get('http://localhost:5000/api/users', {
        headers: {
          'x-auth-token': token
        }
      })

      setUserData({
        token,
        user: {
          id: userRes.data.data.user_id,
          display_name: userRes.data.data.user_name
        }
      })
    }
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" logout={logout} element={<Home  logout={logout}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
