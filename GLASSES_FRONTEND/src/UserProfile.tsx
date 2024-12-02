import React, { useState } from 'react';
import './UserProfile.css';

interface UserProfileProps {
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  phoneNumber: string;
  emailAddress: string;
  password: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  firstName,
  lastName,
  middleName,
  gender,
  phoneNumber,
  emailAddress,
  password,
}) => {
  // State to manage editing
  const [isEditing, setIsEditing] = useState(false);

  // State to manage user details
  const [userDetails, setUserDetails] = useState({
    firstName: firstName || 'John',
    lastName: lastName || 'Doe',
    middleName: middleName || 'Michael',
    gender: gender || 'Male',
    phoneNumber: phoneNumber || '+1234567890',
    emailAddress: emailAddress || 'johndoe@example.com',
    password: password || '********',
    profileImage: 'https://via.placeholder.com/150',
  });

  // State for order visibility
  const [showOrders, setShowOrders] = useState(false);

  // Example order data
  const orders = [
    { id: 1, description: 'Order 1 - Delivered', date: '2024-11-01' },
    { id: 2, description: 'Order 2 - Pending', date: '2024-11-15' },
    { id: 3, description: 'Order 3 - Shipped', date: '2024-11-20' },
  ];

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false); // Disable editing
    console.log('User Details Saved:', userDetails); // Optionally save changes to backend or state
  };

  const toggleOrders = () => {
    setShowOrders(!showOrders);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); // Preview the uploaded image
      setUserDetails((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            <img src={userDetails.profileImage} alt="Profile" />
            {isEditing && (
              <label htmlFor="changeProfileImage" className="edit-profile-image">
                Change
                <input
                  type="file"
                  id="changeProfileImage"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
              </label>
            )}
          </div>
          <div className="profile-info">
            <h2>{`${userDetails.firstName} ${userDetails.lastName}`}</h2>
            <p>{userDetails.middleName}</p>
            <p>{userDetails.gender}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <div className="detail-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={userDetails.firstName}
              disabled={!isEditing}
              onChange={handleInputChange}
            />

            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={userDetails.middleName}
              disabled={!isEditing}
              onChange={handleInputChange}
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              disabled={!isEditing}
              onChange={handleInputChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={userDetails.password}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>

          <div className="detail-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={userDetails.lastName}
              disabled={!isEditing}
              onChange={handleInputChange}
            />

            <label>Gender</label>
            <select
              name="gender"
              value={userDetails.gender}
              disabled={!isEditing}
              onChange={handleInputChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={userDetails.emailAddress}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Profile Actions */}
        <div className="profile-actions">
          <button onClick={() => alert('Redirecting to public profile!')}>VIEW PUBLIC PROFILE</button>
          <button onClick={isEditing ? handleSaveClick : handleEditClick}>
            {isEditing ? 'SAVE' : 'EDIT'}
          </button>
        </div>

        {/* Order Section */}
        <div className="order-section">
          <button onClick={toggleOrders}>
            {showOrders ? 'Hide Orders' : 'Show Current Orders'}
          </button>
          {showOrders && (
            <div className="orders">
              <h3>Current Orders:</h3>
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    {order.description} (Date: {order.date})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
