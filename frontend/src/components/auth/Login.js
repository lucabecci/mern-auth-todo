import React, { useState, useContext } from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import UserContext from '../../context/UserContext'

export default function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const history = useHistory()
    const {setUserData} = useContext(UserContext)

    const submit = async(e) => {
        e.preventDefault()
        const loginUser = {email, password}
        const loginResp = await axios.post('http://localhost:4000/users/login', loginUser)
        setUserData({
            token: loginResp.data.token,
            user: loginResp.data.user
        })
        localStorage.setItem('auth-token', loginResp.data.token)
        history.push('/')
    }
    return (
        <div className='page'>
        <h2>Login</h2>
        <form onSubmit={submit} className='form'>
            <label htmlFor='login-email'>Email</label>
            <input type="email" id='login-email' onChange={e => setEmail(e.target.value)}/>

            <label htmlFor='login-password'>Password</label>
            <input type="password" id='login-password' onChange={e => setPassword(e.target.value)}/>


            <input type="submit" value='login'/>
        </form>
    </div>
    )
}
