import React from 'react'

import { useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google'
import axios from '../axios'
import Link from 'next/link'

export default function Navbar () {
  useGoogleOneTapLogin({
    onSuccess: async credentialResponse => {
      await axios
        .post('/auth/google', {
          token: credentialResponse.credential
        })
        .then(res => {
          console.log(res.data)
          localStorage.setItem('email', res.data.data.email)
          localStorage.setItem('name', res.data.data.name)
          localStorage.setItem('familyName', res.data.data.familyName)
          localStorage.setItem('givenName', res.data.data.givenName)
          localStorage.setItem('googleId', res.data.data.googleId)
          localStorage.setItem('picture', res.data.data.picture)
          localStorage.setItem('id', res.data.data._id)
          localStorage.setItem('token', res.data.token)
          document.querySelector('.profile').src = res.data.data.picture
        })
    },
    onError: () => {
      console.log('Login Failed')
    }
  })

  return (
    <header className='bg-white p-3 flex justify-content-between'>
      <div className='flex gap-6 align-items-center'>
        <Link href='/'><img src='/DSClogo.svg' /></Link>
        <Link href='/'>Home</Link>
        <Link href='/ideas'>Ideas</Link>
      </div>
      <div className='flex gap-6 align-items-center'>
        <img src='#' alt='notif' />
        <img src='#' alt='mess' />
        <img className='profile' height={33} src='#' />
        <GoogleLogin
          onSuccess={credentialResponse => {
            console.log(credentialResponse)
          }}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      </div>
    </header>
  )
}
