import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styled from 'styled-components';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
`;

const StyledField = styled(Field)`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledError = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0051bb;
  }
`;

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const RegisterForm = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`, values);
      if (response.data.jwt) {
        // Store the token in localStorage or a secure cookie
        localStorage.setItem('token', response.data.jwt);
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message[0]?.messages[0]?.message || 'An error occurred during registration');
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={RegisterSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <StyledForm>
          <StyledField name="username" placeholder="Username" />
          {errors.username && touched.username && <StyledError>{errors.username}</StyledError>}

          <StyledField name="email" type="email" placeholder="Email" />
          {errors.email && touched.email && <StyledError>{errors.email}</StyledError>}

          <StyledField name="password" type="password" placeholder="Password" />
          {errors.password && touched.password && <StyledError>{errors.password}</StyledError>}

          {error && <StyledError>{error}</StyledError>}

          <StyledButton type="submit" disabled={isSubmitting}>
            Register
          </StyledButton>
        </StyledForm>
      )}
    </Formik>
  );
};

export default RegisterForm;