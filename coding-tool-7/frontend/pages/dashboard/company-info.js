import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styled from 'styled-components';

import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import { useAuth } from '../../contexts/AuthContext';
import { companyInfoService } from '../../services/api';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
`;

const CompanyInfoSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  tagline: Yup.string(),
  description: Yup.string(),
  logo: Yup.mixed(),
  address: Yup.object().shape({
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zip: Yup.string(),
    country: Yup.string(),
  }),
  phoneNumber: Yup.string(),
  emailAddress: Yup.string().email('Invalid email'),
  businessHours: Yup.string(),
  socialMediaLinks: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string(),
      url: Yup.string().url('Invalid URL'),
    })
  ),
});

const CompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await companyInfoService.getCompanyInfo(user.id);
        setCompanyInfo(response.data);
      } catch (err) {
        setError('Failed to fetch company information');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCompanyInfo();
    }
  }, [user]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'logo' && values[key]) {
          formData.append('logo', values[key]);
        } else if (typeof values[key] === 'object') {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      });

      await companyInfoService.updateCompanyInfo(user.id, formData);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to update company information');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <DashboardLayout>
      <h1>Company Information</h1>
      <Formik
        initialValues={companyInfo || {
          companyName: '',
          tagline: '',
          description: '',
          logo: null,
          address: { street: '', city: '', state: '', zip: '', country: '' },
          phoneNumber: '',
          emailAddress: '',
          businessHours: '',
          socialMediaLinks: [{ platform: '', url: '' }],
        }}
        validationSchema={CompanyInfoSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <StyledForm>
            <FormSection>
              <Field name="companyName" as={Input} placeholder="Company Name" />
              {errors.companyName && touched.companyName && (
                <ErrorMessage>{errors.companyName}</ErrorMessage>
              )}
            </FormSection>

            <FormSection>
              <Field name="tagline" as={Input} placeholder="Tagline" />
            </FormSection>

            <FormSection>
              <Field name="description" as="textarea" placeholder="Description" />
            </FormSection>

            <FormSection>
              <input
                type="file"
                onChange={(event) => {
                  setFieldValue("logo", event.currentTarget.files[0]);
                }}
              />
            </FormSection>

            <FormSection>
              <Field name="address.street" as={Input} placeholder="Street" />
              <Field name="address.city" as={Input} placeholder="City" />
              <Field name="address.state" as={Input} placeholder="State" />
              <Field name="address.zip" as={Input} placeholder="ZIP" />
              <Field name="address.country" as={Input} placeholder="Country" />
            </FormSection>

            <FormSection>
              <Field name="phoneNumber" as={Input} placeholder="Phone Number" />
            </FormSection>

            <FormSection>
              <Field name="emailAddress" as={Input} placeholder="Email Address" />
              {errors.emailAddress && touched.emailAddress && (
                <ErrorMessage>{errors.emailAddress}</ErrorMessage>
              )}
            </FormSection>

            <FormSection>
              <Field name="businessHours" as={Input} placeholder="Business Hours" />
            </FormSection>

            <FormSection>
              <h3>Social Media Links</h3>
              <Field name="socialMediaLinks[0].platform" as={Input} placeholder="Platform" />
              <Field name="socialMediaLinks[0].url" as={Input} placeholder="URL" />
              {errors.socialMediaLinks && errors.socialMediaLinks[0] && (
                <ErrorMessage>{errors.socialMediaLinks[0].url}</ErrorMessage>
              )}
            </FormSection>

            <Button type="submit">Save Company Information</Button>
          </StyledForm>
        )}
      </Formik>
    </DashboardLayout>
  );
};

export default CompanyInfo;