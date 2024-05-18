import React from 'react';
import '../styles/NoMatch.css'
import { Result } from 'antd';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';

const NoMatch = () => {

  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Quiz App - 404</title>
      </Helmet>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<button className='btn' type="button" onClick={() => navigate("/dashboard")}>Back Home</button>}
      />
    </>
  )
}
export default NoMatch;