import React, { useContext } from 'react';
import './emergencynotice.scss';
import AdminContext from '../../context/Admin/AdminContext';
import Header from '../Navbar/Header';
import { Redirect, Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { GrFormTrash } from 'react-icons/gr';
import { FaQuoteRight } from 'react-icons/fa';

const EmergencyNotice = () => {
  const { adminDetails, readEmergency, deleteEmNotice } =
    useContext(AdminContext);
  const { emergencyAlert } = adminDetails;

  if (emergencyAlert === null) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <div className='notice-main-container'>
      <Header />
      <div className='notice-container'>
        <div className='notice-headers'>
          <h2>Emergency Notifications</h2>
        </div>
        {emergencyAlert.map((notice) => {
          const { read, user, _id } = notice;
          return (
            <div className='notice' key={_id}>
              <div
                className={
                  read === 'false'
                    ? 'notice-details unread-details'
                    : 'notice-details'
                }
              >
                <FiAlertTriangle className='notice-icon' /> User:
                <Link
                  to={`/user/${user}`}
                  style={{
                    textDecoration: 'none',
                    paddingLeft: '.5em',
                    paddingRight: '.5em',
                    fontSize: '1.15em',
                  }}
                  target='_blank'
                >
                  {user}
                </Link>{' '}
                has high alert emergency. Please check the map for futher
                details.
                <div className='actions-container'>
                  <GrFormTrash onClick={() => deleteEmNotice(_id)} />
                  <FaQuoteRight onClick={() => readEmergency(_id)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmergencyNotice;
