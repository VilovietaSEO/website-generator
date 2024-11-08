import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { login } from '../../services/api/authService';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const userData = await login(values.email, values.password);
        setUser(userData);
        router.push('/dashboard');
      } catch (err) {
        setError('Invalid email or password');
      }
    },
  });

  return (
    <FormContainer>
      <h2>Login</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <form onSubmit={formik.handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <ErrorMessage>{formik.errors.email}</ErrorMessage>
        ) : null}

        <Input
          type="password"
          name="password"
          placeholder="Password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <ErrorMessage>{formik.errors.password}</ErrorMessage>
        ) : null}

        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

export default LoginForm;