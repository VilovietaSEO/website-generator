import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Modal from '../../components/UI/Modal';
import Spinner from '../../components/UI/Spinner';
import ToastNotification from '../../components/UI/ToastNotification';
import { getServices, createService, updateService, deleteService } from '../../services/api/serviceService';
import { useAuth } from '../../contexts/AuthContext';

const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ServiceSchema = Yup.object().shape({
  serviceName: Yup.string().required('Service name is required'),
  serviceDescription: Yup.string().required('Service description is required'),
  serviceKeywords: Yup.string().required('Keywords are required'),
});

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setToast({ show: true, message: 'Failed to fetch services', type: 'error' });
      setIsLoading(false);
    }
  };

  const handleOpenModal = (service = null) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentService(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (currentService) {
        await updateService(currentService.id, values);
        setToast({ show: true, message: 'Service updated successfully', type: 'success' });
      } else {
        await createService(values);
        setToast({ show: true, message: 'Service created successfully', type: 'success' });
      }
      fetchServices();
      handleCloseModal();
      resetForm();
    } catch (error) {
      console.error('Error submitting service:', error);
      setToast({ show: true, message: 'Failed to save service', type: 'error' });
    }
    setSubmitting(false);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(serviceId);
        setToast({ show: true, message: 'Service deleted successfully', type: 'success' });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        setToast({ show: true, message: 'Failed to delete service', type: 'error' });
      }
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <DashboardLayout>
      <h1>Services</h1>
      <Button onClick={() => handleOpenModal()}>Add New Service</Button>
      <ServicesContainer>
        {services.map((service) => (
          <Card key={service.id}>
            <h3>{service.serviceName}</h3>
            <p>{service.serviceDescription}</p>
            <p>Keywords: {service.serviceKeywords}</p>
            <Button onClick={() => handleOpenModal(service)}>Edit</Button>
            <Button onClick={() => handleDelete(service.id)} variant="danger">Delete</Button>
          </Card>
        ))}
      </ServicesContainer>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>{currentService ? 'Edit Service' : 'Add New Service'}</h2>
        <Formik
          initialValues={{
            serviceName: currentService?.serviceName || '',
            serviceDescription: currentService?.serviceDescription || '',
            serviceKeywords: currentService?.serviceKeywords || '',
          }}
          validationSchema={ServiceSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field name="serviceName" as={Input} placeholder="Service Name" error={touched.serviceName && errors.serviceName} />
              <Field name="serviceDescription" as={Input} placeholder="Service Description" error={touched.serviceDescription && errors.serviceDescription} />
              <Field name="serviceKeywords" as={Input} placeholder="Keywords (comma-separated)" error={touched.serviceKeywords && errors.serviceKeywords} />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Service'}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </DashboardLayout>
  );
};

export default Services;