import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { companyInfoService } from '../../services/api/companyInfoService';
import { Button, Input, Select, TextArea } from '../UI';
import { ToastNotification } from '../UI/ToastNotification';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required('Company name is required'),
  tagline: Yup.string().max(100, 'Tagline must be 100 characters or less'),
  description: Yup.string().max(500, 'Description must be 500 characters or less'),
  address: Yup.object().shape({
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string().required('ZIP code is required'),
    country: Yup.string().required('Country is required'),
  }),
  phoneNumber: Yup.string().matches(/^[0-9]+$/, 'Must be only digits').min(10, 'Must be at least 10 digits'),
  emailAddress: Yup.string().email('Invalid email').required('Email is required'),
  businessHours: Yup.string(),
});

const CompanyInfoForm = ({ projectId }) => {
  const [initialValues, setInitialValues] = useState({
    companyName: '',
    tagline: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    phoneNumber: '',
    emailAddress: '',
    businessHours: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await companyInfoService.getCompanyInfo(projectId);
        if (data) {
          setInitialValues(data);
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };

    if (projectId) {
      fetchCompanyInfo();
    }
  }, [projectId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await companyInfoService.updateCompanyInfo(projectId, values);
      setToastMessage('Company information saved successfully!');
      setShowToast(true);
      router.push(`/dashboard/projects/${projectId}`);
    } catch (error) {
      console.error('Error saving company info:', error);
      setToastMessage('Error saving company information. Please try again.');
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <FieldWrapper>
              <Field name="companyName" as={Input} placeholder="Company Name" />
              <ErrorMessage name="companyName" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="tagline" as={Input} placeholder="Tagline" />
              <ErrorMessage name="tagline" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="description" as={TextArea} placeholder="Company Description" />
              <ErrorMessage name="description" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="address.street" as={Input} placeholder="Street Address" />
              <ErrorMessage name="address.street" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="address.city" as={Input} placeholder="City" />
              <ErrorMessage name="address.city" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="address.state" as={Input} placeholder="State" />
              <ErrorMessage name="address.state" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="address.zip" as={Input} placeholder="ZIP Code" />
              <ErrorMessage name="address.zip" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="address.country" as={Select} placeholder="Country">
                <option value="">Select a country</option>
                <option value="USA">United States</option>
                <option value="CAN">Canada</option>
                {/* Add more countries as needed */}
              </Field>
              <ErrorMessage name="address.country" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="phoneNumber" as={Input} placeholder="Phone Number" />
              <ErrorMessage name="phoneNumber" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="emailAddress" as={Input} placeholder="Email Address" type="email" />
              <ErrorMessage name="emailAddress" component={ErrorText} />
            </FieldWrapper>

            <FieldWrapper>
              <Field name="businessHours" as={TextArea} placeholder="Business Hours" />
              <ErrorMessage name="businessHours" component={ErrorText} />
            </FieldWrapper>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Company Information'}
            </Button>
          </StyledForm>
        )}
      </Formik>
      {showToast && (
        <ToastNotification
          message={toastMessage}
          type={toastMessage.includes('Error') ? 'error' : 'success'}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default CompanyInfoForm;