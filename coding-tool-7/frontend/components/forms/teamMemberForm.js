import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { teamMemberService } from '../../services/api/teamMemberService';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';
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

const TeamMemberForm = ({ projectId, teamMemberId = null }) => {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState({
    memberName: '',
    positionTitle: '',
    bio: '',
    photo: null,
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (teamMemberId) {
      fetchTeamMember();
    }
  }, [teamMemberId]);

  const fetchTeamMember = async () => {
    try {
      const teamMember = await teamMemberService.getTeamMember(projectId, teamMemberId);
      setInitialValues({
        memberName: teamMember.memberName,
        positionTitle: teamMember.positionTitle,
        bio: teamMember.bio,
        photo: null, // We don't set the photo here as it's a file input
        socialLinks: teamMember.socialLinks,
      });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to fetch team member data' });
    }
  };

  const validationSchema = Yup.object().shape({
    memberName: Yup.string().required('Name is required'),
    positionTitle: Yup.string().required('Position title is required'),
    bio: Yup.string().required('Bio is required'),
    photo: Yup.mixed().test('fileSize', 'File is too large', (value) => {
      if (!value) return true; // Allows empty values
      return value.size <= 5000000; // 5MB limit
    }),
    socialLinks: Yup.object().shape({
      linkedin: Yup.string().url('Must be a valid URL'),
      twitter: Yup.string().url('Must be a valid URL'),
      github: Yup.string().url('Must be a valid URL'),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'socialLinks') {
          formData.append(key, JSON.stringify(values[key]));
        } else if (key === 'photo' && values[key]) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      if (teamMemberId) {
        await teamMemberService.updateTeamMember(projectId, teamMemberId, formData);
        setNotification({ type: 'success', message: 'Team member updated successfully' });
      } else {
        await teamMemberService.createTeamMember(projectId, formData);
        setNotification({ type: 'success', message: 'Team member created successfully' });
      }
      router.push(`/dashboard/projects/${projectId}/team-members`);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to save team member' });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <>
      {notification && (
        <ToastNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, isSubmitting }) => (
          <StyledForm>
            <Field name="memberName" as={Input} label="Name" placeholder="Enter member name" />
            <ErrorMessage name="memberName" component={ErrorText} />

            <Field name="positionTitle" as={Input} label="Position" placeholder="Enter position title" />
            <ErrorMessage name="positionTitle" component={ErrorText} />

            <Field name="bio" as="textarea" placeholder="Enter bio" />
            <ErrorMessage name="bio" component={ErrorText} />

            <input
              type="file"
              onChange={(event) => {
                setFieldValue("photo", event.currentTarget.files[0]);
              }}
            />
            <ErrorMessage name="photo" component={ErrorText} />

            <Field name="socialLinks.linkedin" as={Input} label="LinkedIn" placeholder="LinkedIn URL" />
            <ErrorMessage name="socialLinks.linkedin" component={ErrorText} />

            <Field name="socialLinks.twitter" as={Input} label="Twitter" placeholder="Twitter URL" />
            <ErrorMessage name="socialLinks.twitter" component={ErrorText} />

            <Field name="socialLinks.github" as={Input} label="GitHub" placeholder="GitHub URL" />
            <ErrorMessage name="socialLinks.github" component={ErrorText} />

            <Button type="submit" disabled={isSubmitting || isLoading}>
              {teamMemberId ? 'Update Team Member' : 'Add Team Member'}
            </Button>
          </StyledForm>
        )}
      </Formik>
    </>
  );
};

export default TeamMemberForm;