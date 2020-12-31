import React, { useState, useContext } from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import UserContext from '../../context/UserContext'
export default function Register() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [passwordCheck, setPasswordCheck] = useState()
    const [displayName, setDisplayName] = useState()
    const history = useHistory()
    const {setUserData} = useContext(UserContext)

    const submit = async(e) => {
        e.preventDefault()
        const newUser = {email, password, passwordCheck, displayName}

        await axios.post('http://localhost:4000/users/register', newUser)
        const loginResp = await axios.post('http://localhost:4000/users/login', {email, password})
        setUserData({
            token: loginResp.data.token,
            user: loginResp.data.user
        })
        localStorage.setItem('auth-token', loginResp.data.token)
        history.push('/')
    }
    return (
        <div className='page'>
            <h2>Register</h2>
            <form onSubmit={submit} className='form'>
                <label htmlFor='register-email'>Email</label>
                <input type="email" id='register-email' onChange={e => setEmail(e.target.value)}/>

                <label htmlFor='register-password'>Password</label>
                <input type="password" id='register-password' onChange={e => setPassword(e.target.value)}/>

                <label htmlFor='register-password'>Check Password</label>
                <input type="password" placeholder='verify password' onChange={e => setPasswordCheck(e.target.value)}/>

                <label htmlFor='register-display-name'>Display Name</label>
                <input type="text" id='register-display-name' onChange={e => setDisplayName(e.target.value)}/>


                <input type="submit" value='register'/>
            </form>
        </div>
    )
}
