import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { setUserInfo } from '../app/slices/authSlice'

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

  // useGoogleOneTapLogin({
  //   onSuccess: credentialResponse => getAuthToken(credentialResponse.credential, dispatch),
  //   onError: () => {
  //     console.log('Login Failed')
  //   }
  // })

  return (
    <header className='bg-white p-3 flex justify-content-between'>
      <div className='flex md:gap-5 gap-3 align-items-center'>
        <Link to='/'><img alt='logo' src='/DSClogo.svg' /></Link>
        <Link to='/'>Home</Link>
        <Link to='/ideas'>Ideas</Link>
      </div>
      <div className='md:flex hidden md:gap-5 gap-3 align-items-center'>
        {auth.token
          ? <><img src='#' alt='notif' />
            <img src='#' alt='mess' />
            <img alt='profile' className='profile' height={33} src={auth.picture} />
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
      <div className='md:hidden'>
        <button />
      </div>
    </header>
  )
}
