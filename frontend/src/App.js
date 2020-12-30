import React, { Fragment, useEffect, useState } from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import axios from 'axios'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Header from './components/layouts/Header'
import Home from './components/pages/Home'
import UserContext from './context/UserContext'

import './style.css'

export default function App() {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    })

    useEffect(() => {
        const checkLoggedIn = async () => {
            let token = localStorage.getItem("auth-token")
            if(token === null) {
                localStorage.setItem("auth-token", "")
                token = ""
            }
            const tokenResp = await axios.post('http://localhost:4000/users/tokenIsValid', null, {
                headers:  {"x-auth-token": token}
            })
            if(tokenResp.data) {
                const userResp = await axios.get(
                    'http://localhost:4000/users',
                    {headers: {'x-auth-token': token}})
                setUserData({
                    token,
                    user: userResp.data
                })
            }
        }
        checkLoggedIn()
    }, []);

    return (
        <Fragment>
            <BrowserRouter>
                <UserContext.Provider value={{userData, setUserData}}>
                    <Header/>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route path='/login' component={Login}/>
                        <Route path='/register' component={Register}/>
                    </Switch>
                </UserContext.Provider>
            </BrowserRouter>
        </Fragment>
    )
}
