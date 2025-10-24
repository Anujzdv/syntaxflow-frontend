// src/pages/Profile.jsx
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profileImage || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-avatar"
        />
        <h2>{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-bio">{user.bio}</p>
        {/* We can add an "Edit Profile" button here later */}
      </div>

      <div className="profile-stats">
        {/* We will add stats here in a future step */}
        {/* <h3>Your Stats</h3>
        <p>Snippets Posted: {user.snippets.length}</p>
        <p>Quizzes Taken: {user.quizResults.length}</p> */}
      </div>
    </div>
  );
};

export default Profile;