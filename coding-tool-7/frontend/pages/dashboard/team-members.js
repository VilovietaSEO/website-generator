import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import TeamMemberForm from '../../components/Forms/TeamMemberForm';
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '../../services/api/teamMemberService';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Card from '../../components/UI/Card';
import Spinner from '../../components/UI/Spinner';
import ToastNotification from '../../components/UI/ToastNotification';
import styles from '../../styles/components/TeamMembers.module.css';

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const router = useRouter();

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getTeamMembers();
      setTeamMembers(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch team members');
      setIsLoading(false);
    }
  };

  const handleCreateMember = async (memberData) => {
    try {
      const newMember = await createTeamMember(memberData);
      setTeamMembers([...teamMembers, newMember]);
      setIsModalOpen(false);
      showToast('Team member added successfully', 'success');
    } catch (err) {
      showToast('Failed to add team member', 'error');
    }
  };

  const handleUpdateMember = async (memberData) => {
    try {
      const updatedMember = await updateTeamMember(editingMember.id, memberData);
      setTeamMembers(teamMembers.map(member => member.id === updatedMember.id ? updatedMember : member));
      setIsModalOpen(false);
      setEditingMember(null);
      showToast('Team member updated successfully', 'success');
    } catch (err) {
      showToast('Failed to update team member', 'error');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeamMember(memberId);
        setTeamMembers(teamMembers.filter(member => member.id !== memberId));
        showToast('Team member deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete team member', 'error');
      }
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const openModal = (member = null) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  if (isLoading) return <Spinner />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <DashboardLayout>
      <div className={styles.teamMembersContainer}>
        <h1 className={styles.title}>Team Members</h1>
        <Button onClick={() => openModal()} className={styles.addButton}>Add Team Member</Button>
        <div className={styles.teamMembersList}>
          {teamMembers.map(member => (
            <Card key={member.id} className={styles.memberCard}>
              <img src={member.photoUrl} alt={member.memberName} className={styles.memberPhoto} />
              <h3>{member.memberName}</h3>
              <p>{member.positionTitle}</p>
              <div className={styles.cardActions}>
                <Button onClick={() => openModal(member)} className={styles.editButton}>Edit</Button>
                <Button onClick={() => handleDeleteMember(member.id)} className={styles.deleteButton}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <TeamMemberForm
            onSubmit={editingMember ? handleUpdateMember : handleCreateMember}
            initialData={editingMember}
          />
        </Modal>
        {toast.show && <ToastNotification message={toast.message} type={toast.type} />}
      </div>
    </DashboardLayout>
  );
};

export default TeamMembers;