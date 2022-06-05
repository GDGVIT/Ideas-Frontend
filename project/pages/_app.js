import '../styles/globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'

import '/node_modules/primeflex/primeflex.css'

import Layout from '../components/Layout'

function MyApp ({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GoogleOAuthProvider>
  )
}

export default MyApp
