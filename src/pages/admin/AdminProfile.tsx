import React from 'react';
import ProfilePage from '../../components/profile/ProfilePage';

const AdminProfile: React.FC = () => (
  <ProfilePage title="Profile" subtitle="Your administrator account" showLogout />
);

export default AdminProfile;
