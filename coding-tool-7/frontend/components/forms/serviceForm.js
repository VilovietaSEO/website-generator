import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { createService, updateService, getService } from '../../services/api/serviceService';
import Button from '../UI/Button';
import Input from '../UI/Input';
import ToastNotification from '../UI/ToastNotification';

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ServiceSchema = Yup.object().shape({
  serviceName: Yup.string().required('Service name is required'),
  serviceDescription: Yup.string().required('Service description is required'),
  serviceKeywords: Yup.string().required('Service keywords are required'),
});

const ServiceForm = ({ projectId, serviceId }) => {
  const [initialValues, setInitialValues] = useState({
    serviceName: '',
    serviceDescription: '',
    serviceKeywords: '',
    serviceImage: null,
  });
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (serviceId) {
      fetchServiceData();
    }
  }, [serviceId]);

  const fetchServiceData = async () => {
    try {
      const service = await getService(projectId, serviceId);
      setInitialValues({
        serviceName: service.serviceName,
        serviceDescription: service.serviceDescription,
        serviceKeywords: service.serviceKeywords.join(', '),
        serviceImage: service.serviceImage,
      });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to fetch service data' });
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('serviceName', values.serviceName);
      formData.append('serviceDescription', values.serviceDescription);
      formData.append('serviceKeywords', values.serviceKeywords);
      if (values.serviceImage) {
        formData.append('serviceImage', values.serviceImage);
      }

      if (serviceId) {
        await updateService(projectId, serviceId, formData);
        setNotification({ type: 'success', message: 'Service updated successfully' });
      } else {
        await createService(projectId, formData);
        setNotification({ type: 'success', message: 'Service created successfully' });
      }

      router.push(`/dashboard/projects/${projectId}/services`);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to save service' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ServiceSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue }) => (
          <StyledForm>
            <Field name="serviceName" as={Input} placeholder="Service Name" />
            <ErrorMessage name="serviceName" component={ErrorText} />

            <Field name="serviceDescription" as={Input} placeholder="Service Description" component="textarea" />
            <ErrorMessage name="serviceDescription" component={ErrorText} />

            <Field name="serviceKeywords" as={Input} placeholder="Service Keywords (comma-separated)" />
            <ErrorMessage name="serviceKeywords" component={ErrorText} />

            <input
              type="file"
              onChange={(event) => {
                setFieldValue("serviceImage", event.currentTarget.files[0]);
              }}
            />

            <Button type="submit" disabled={isSubmitting}>
              {serviceId ? 'Update Service' : 'Create Service'}
            </Button>
          </StyledForm>
        )}
      </Formik>
      {notification && (
        <ToastNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default ServiceForm;