import React, {useContext, useState} from 'react'
import { useNavigate , Link} from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import axios from "axios"


function SignUp() {
    const [form , setForm] = useState({})
    const navigate = useNavigate()
    const [userData, setUserData] = useContext(UserContext)

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post("http://localhost:5000/api/users", {
                userName:form.userName, 
                firstName: form.firstName, 
                lastName: form.lastName, 
                email: form.email, 
                password: form.password
            })
            console.log(form)
            const loginRes = await axios.post("http://localhost:5000/api/users/login", {
                email: form.email,
                password: form.password
            })

            setUserData({
                token: loginRes.data.token,
                user: loginRes.data.user
            })

            localStorage.setItem("auth-token", loginRes.data.token)
            navigate("/")
        } catch (err) {
            console.log("problem ==>", err.response.data.msg)
            alert(err.response.data.msg)
        }
   }
  return (
    <div>
        <h1>SignUp</h1>
        <form onSubmit={handleSubmit}> 
            <label>First Name: </label>
            <input 
                type="text"
                name="firstName"
                onChange={handleChange}
            /><br />
            <label>Last Name: </label>
            <input 
                type="text"
                name="lastName"
                onChange={handleChange}
            /><br />
            <label>User Name: </label>
            <input 
                type="text"
                name="userName"
                onChange={handleChange}
            /><br />
            <label>Email: </label>
            <input 
                type="email"
                name="email"
                onChange={handleChange}
            /><br />
            <label>Password: </label>
            <input 
                type="password"
                name="password"
                onChange={handleChange}
            /><br />
            <button>Submit</button>
        </form>
        <Link to="/login">Already have an account</Link>
    </div>
  )
}

export default SignUp