import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setUserInfo, logout } from '../app/slices/authSlice'
import { listenForOutsideClicks } from '../utils/listenForOutsideClicks'

import { GoogleLogin } from '@react-oauth/google'
import axios from '../axios'

const getAuthToken = async (cred, dispatch) => {
  await axios
    .post('/auth/google', {
      token: cred
    })
    .then(res => {
      console.log(res.data)
      localStorage.setItem('email', res.data.data.email)
      localStorage.setItem('name', res.data.data.name)
      localStorage.setItem('familyName', res.data.data.familyName)
      localStorage.setItem('givenName', res.data.data.givenName)
      localStorage.setItem('googleId', res.data.data.googleId)
      localStorage.setItem('picture', res.data.data.picture)
      localStorage.setItem('_id', res.data.data._id)
      localStorage.setItem('token', res.data.token)
      dispatch(setUserInfo({ data: res.data.data, token: res.data.token }))
    })
}

export default function Navbar () {
  const dispatch = useDispatch()

  const auth = useSelector(state => state.auth)

  const [menuHidden, setMenuHidden] = useState(true)
  const [phoneMenuHidden, setPhoneMenuHidden] = useState(true)

  const menuRef = useRef(null)
  const [listening, setListening] = useState(false)

  useEffect(listenForOutsideClicks(
    listening,
    setListening,
    menuRef,
    setMenuHidden
  ))

  useEffect(listenForOutsideClicks(
    listening,
    setListening,
    menuRef,
    setPhoneMenuHidden
  ))

  const userMenu = () => {
    console.log('ok')
    setMenuHidden(!menuHidden)
  }
  const phoneUserMenu = () => {
    setPhoneMenuHidden(!phoneMenuHidden)
  }

  return (
    <header ref={menuRef} className='bg-white px-4 py-2 flex justify-content-between relative z-1'>
      {auth.token
        ? <div id='usermenu' className={`absolute usermenu border-round-xl p-3 bg-white ideacard flex-column z-2 ${menuHidden ? 'hidden' : 'flex'}`}>
          <span className='flex flex-row gap-2'>
            <img src={require('../assets/usericon.svg').default} alt='usericon' />
            <p className='bodytext'>{auth.name}</p>
          </span>
          <button onClick={() => dispatch(logout())} className='mt-2 logout-button'>Logout</button>
          </div>
        : null}
      {auth.token
        ? <div id='usermenu' className={`absolute usermenu border-round-xl p-3 bg-white ideacard flex-column z-2 ${phoneMenuHidden ? 'hidden' : 'flex'}`}>
          <span className='flex flex-row gap-2'>
            <img src={require('../assets/usericon.svg').default} alt='usericon' />
            <p className='bodytext'>{auth.name}</p>
          </span>
          <button onClick={() => dispatch(logout())} className='mt-2 logout-button'>Logout</button>
        </div>
        : null}
      <div className='flex md:gap-5 gap-3 align-items-center'>
        <Link className='flex flex-row align-items-center' to='/'><img alt='logo' src={require('../assets/DSClogo.svg').default} /></Link>
        <Link className='bodytext font-16' to='/'>Home</Link>
        <Link className='bodytext font-16' to='/ideas'>Ideas</Link>
      </div>
      <div className='md:flex hidden md:gap-5 gap-3 align-items-center'>
        {auth.token
          ? <>
            <img src={require('../assets/bellSymbol.svg').default} alt='notif' />
            <img src={require('../assets/messageSymbol.svg').default} alt='mess' />
            <img alt='pfp' className='pfp' onClick={userMenu} width={33} src={auth.picture} />
          </>
          : <GoogleLogin
              onSuccess={credentialResponse => {
                getAuthToken(credentialResponse.credential, dispatch)
              }}
              onError={() => {
                console.log('Login Failed')
              }}
              useOneTap
            />}
      </div>
      <div className='md:hidden mt-1'>
        <input type='image' src={require('../assets/hamburger.png')} onClick={phoneUserMenu} alt='ham' />
      </div>
    </header>
  )
}
