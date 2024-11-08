import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { login } from '../services/api/authService';
import { Button, Input, Card, ToastNotification } from '../components/UI';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        const response = await login(values.email, values.password);
        localStorage.setItem('token', response.data.jwt);
        router.push('/dashboard');
      } catch (err) {
        setError('Invalid email or password');
      }
    },
  });

  return (
    <LoginContainer>
      <LoginCard>
        <h1>Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <ErrorText>{formik.errors.email}</ErrorText>
          )}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <ErrorText>{formik.errors.password}</ErrorText>
          )}
          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        {error && <ToastNotification message={error} type="error" />}
      </LoginCard>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export default LoginPage;