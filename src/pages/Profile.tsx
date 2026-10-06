import React from 'react';
import ProfilePage from '../components/profile/ProfilePage';

const Profile: React.FC = () => (
  <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
    <ProfilePage title="My Profile" subtitle="Manage your account information" />
  </div>
);

export default Profile;
