import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from "axios"
function Login() {
    const [userData, setUserData] = useContext(UserContext)
    const navigate = useNavigate()
    const [form, setForm] = useState({})

    const handelChange = (e) => {
        setForm({... form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const loginRes = await axios.post("http://localhost:5000/api/users/login", {
                email: form.email,
                password: form.password
            })

            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user
            })

            localStorage.setItem('auth-token', loginRes.data.token)

            navigate("/")
        } catch (err) {
            console.log("problem", err.respose.data.msg)
            alert(err.respose.data.msg)
        }
    }


    useEffect(() => {
        if (!userData.user) navigate("/login")
    }, [userData.user])
  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <label>Email: </label>
            <input 
                type="email" 
                name="email" 
                onChange={handelChange} 
                required 
            /><br />
            <label>Password: </label>
            <input 
                type="password"
                name="password"
                onChange={handelChange}
                required
            /><br />
            <button type="submit">Login</button>
        </form>
        <Link to="/signup">Create a new account</Link>
    </div>
  )
}

export default Login