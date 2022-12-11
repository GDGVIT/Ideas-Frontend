import React from 'react'
import { Link } from 'react-router-dom'

const ConditionalLink = ({ children, to, condition, ...props }) => (!!condition && to)
  ? <Link {...props} to={to}>{children}</Link>
  : <>{children}</>

export default ConditionalLink
