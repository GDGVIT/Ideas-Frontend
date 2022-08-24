import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setUserInfo, logout } from '../app/slices/authSlice'
import { listenForOutsideClicks } from '../utils/listenForOutsideClicks'

import { GoogleLogin } from '@react-oauth/google'
import axios from '../axios'
import { toast } from 'react-toastify'

export default function Navbar () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getAuthToken = async (cred, dispatch) => {
    await axios
      .post('/auth/google', {
        token: cred
      })
      .then(res => {
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
      .catch(() => {
        dispatch(logout())
        navigate('/')
      })
  }

  const auth = useSelector(state => state.auth)
  const notif = useSelector
  (state => state.notif)

  const [menuHidden, setMenuHidden] = useState(true)
  const [phoneMenuHidden, setPhoneMenuHidden] = useState(true)

  const menuRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [unread, setUnread] = useState(false)

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
    setMenuHidden(!menuHidden)
  }
  const phoneUserMenu = () => {
    setPhoneMenuHidden(!phoneMenuHidden)
  }
  const black = useSelector(state => state.black)

  return (
    <header ref={menuRef} className={`bg-white md:px-4 px-3 py-2 flex justify-content-between align-items-center relative ${black.entered ? 'z-5' : 'z-3'}`}>
      {auth.token
        ? <div id='usermenu' className={`absolute usermenu border-round-xl p-3 bg-white ideacard flex-column z-5 ${menuHidden ? 'hidden' : 'flex'}`}>
          <span className='flex flex-row gap-2'>
            <img src={require('../assets/usericon.svg').default} alt='usericon' />
            <p className='bodytext'>{auth.name}</p>
          </span>
          <button onClick={() => dispatch(logout())} className='mt-2 logout-button'>Logout</button>
          </div>
        : null}
      {auth.token
        ? <div id='usermenu' style={{ transform: 'translateZ(10px)' }} className={`absolute usermenu-mobile border-round-xl z-5 p-3 bg-white ideacard flex-column ${phoneMenuHidden ? 'hidden' : 'flex'}`}>
          <span className='flex flex-row gap-4 justify-content-center'>
            <Link className='flex h-min' to='/mentions'>
              {notif && notif.unreads
                ? <img src={require('../assets/bellSymbolBlue.svg').default} alt='notif' />
                : <img src={require('../assets/bellSymbol.svg').default} alt='notif' />}
            </Link>
            <Link className='flex h-min' to='/comments'>
              <img src={require('../assets/messageSymbol.svg').default} alt='mess' />
            </Link>
          </span>
          <span className='flex flex-row gap-2 mt-3'>
            <img src={require('../assets/usericon.svg').default} alt='usericon' />
            <p className='bodytext'>{auth.name}</p>
          </span>
          <button onClick={() => dispatch(logout())} className='mt-2 logout-button'>Logout</button>
        </div>
        : null}
      <div className='flex md:gap-5 gap-3 align-items-center'>
        <Link className='flex flex-row align-items-center' to='/'><img alt='logo' src={require('../assets/DSClogo.svg').default} /></Link>
        <Link className='bodytext md:font-16' to='/'>Home</Link>
        <Link className='bodytext font-16' to='/ideas'>Ideas</Link>
        {auth.token
          ? <Link to='/ideas/new'>
            <button className='primary-button sm:block hidden lg:font-20 py-2 px-3 font-16'>Add an Idea</button>
            <button className='primary-button sm:hidden block lg:font-20 py-2 px-3 font-16'>Add Idea</button>
          </Link>
          : null}
      </div>
      <div className='md:flex hidden md:gap-5 gap-3 align-items-center'>
        {auth.token
          ? <>
            <Link className='flex h-min' to='/mentions'>
              {notif && notif.unreads
                ? <img src={require('../assets/bellSymbolBlue.svg').default} alt='notif' />
                : <img src={require('../assets/bellSymbol.svg').default} alt='notif' />}
            </Link>
            <Link className='flex h-min' to='/comments'>
              <img src={require('../assets/messageSymbol.svg').default} alt='mess' />
            </Link>
            <span className='flex'>
              <img alt='pfp' className='pfp pfp-nav' onClick={userMenu} width={33} src={auth.picture} referrerPolicy='no-referrer' />
            </span>
          </>
          : <GoogleLogin
              onSuccess={credentialResponse => {
                getAuthToken(credentialResponse.credential, dispatch)
              }}
              onError={() => {
                toast.error("Login failed.")
              }}
              useOneTap
            />}
      </div>
      <div className='md:hidden h-min'>
        <input type='image' src={require('../assets/hamburger.png')} onClick={phoneUserMenu} alt='ham' />
      </div>
    </header>
  )
}
