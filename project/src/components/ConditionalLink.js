import React from 'react'
import { Link } from 'react-router-dom';

const ConditionalLink = ({ children, to, condition }) => (!!condition && to)
? <Link to={to}>{children}</Link>
: <>{children}</>;

export default ConditionalLink;
