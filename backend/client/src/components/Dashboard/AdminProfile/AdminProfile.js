import React, { useContext, useState } from 'react';
import './adminprofile.scss';
import Header from '../../Navbar/Header';
import { Link, withRouter } from 'react-router-dom';
import AdminContext from '../../../context/Admin/AdminContext';
import { endpoints } from '../../../utils/endpoints';

const baseURL = process.env.REACT_APP_API_KEY;
const admin = endpoints.admin;

const AdminProfile = ({ location, history }) => {
  const { uploadAdminImg, deleteAdminImg } = useContext(AdminContext);

  const { fullname, position, profilePic } = location;

  const [file, setFile] = useState(null);
  const [showForm, setshowForm] = useState(false);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('file', file);
    uploadAdminImg(fd, history);
  };

  return (
    <div>
      <Header />

      <div className='admin-profile-main'>
        <div className='admin-details'>
          <div className='admin-img-control'>
            <div>
              <div className='admin-img-container'>
                <img
                  src={`${baseURL}${admin.adminImg}${profilePic}`}
                  alt=''
                  className='admin-img'
                />
                <button className='show-update-form'>
                  Update Profile Picture
                </button>
              </div>
              <div className='admin-headers'>
                <h5>{fullname ? fullname : 'Admin Name'}</h5>
                <small>{position ? position : 'Admin Position'}</small>
              </div>
            </div>
            {showForm && (
              <form className='upload-admin-form'>
                <input
                  type='file'
                  name='file'
                  onChange={(e) => handleChange(e)}
                  encType='multipart/form-data'
                />
                <button
                  className='upload-admin-img'
                  onClick={(e) => handleSubmit(e)}
                >
                  Update Profile Pic
                </button>
                <button
                  className='cancel-upload'
                  onClick={(e) => {
                    e.preventDefault();
                    setshowForm(false);
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
            <Link
              to='/dashboard'
              style={{ color: '#333', textDecoration: 'none' }}
            >
              Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AdminProfile);
