import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styled from 'styled-components';

import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const RegisterPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/local/register`, {
        username: values.email,
        email: values.email,
        password: values.password,
      });

      if (response.data.jwt) {
        localStorage.setItem('token', response.data.jwt);
        toast.success('Registration successful!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data?.message || error.message);
      toast.error('Registration failed. Please try again.');
      setErrors({ submit: error.response?.data?.message || 'An error occurred during registration.' });
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <RegisterContainer>
      <h1>Register</h1>
      <Formik
        initialValues={{ email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <StyledForm>
            <Field
              as={Input}
              type="email"
              name="email"
              placeholder="Email"
              error={touched.email && errors.email}
            />
            <Field
              as={Input}
              type="password"
              name="password"
              placeholder="Password"
              error={touched.password && errors.password}
            />
            <Field
              as={Input}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              error={touched.confirmPassword && errors.confirmPassword}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
            {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          </StyledForm>
        )}
      </Formik>
      <ToastContainer />
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 20px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  margin-top: 10px;
  text-align: center;
`;

export default RegisterPage;