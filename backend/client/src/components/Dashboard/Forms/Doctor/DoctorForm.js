import React, { useState, useContext } from 'react';
import DoctorContext from '../../../../context/Doctor/DoctorContext';
import { endpoints } from '../../../../utils/endpoints';

const baseURL = process.env.REACT_APP_API_KEY;
const doctor = endpoints.doctors;

const DoctorForm = ({ setShowAddDoctor }) => {
  const { uploadDoctorImg, uploadDoctorImgId, addDoctorDetails } =
    useContext(DoctorContext);

  const [file, setFile] = useState(null);

  const doctorPicHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const [doctorDetails, setDoctorDetails] = useState({
    name: '',
    contactNo: '',
    speciality: '',
    address: '',
    education: '',
  });

  const doctorDetailsHandler = (e) => {
    setDoctorDetails({ ...doctorDetails, [e.target.name]: e.target.value });
  };

  const doctorSubmitHandler = (e) => {
    e.preventDefault();
    addDoctorDetails(doctorDetails, uploadDoctorImgId);
    setShowAddDoctor(false);
  };

  return (
    <div className='form-doctor-container'>
      <h4>Add Doctor Details</h4>
      <div className='display-grid-form'>
        <div className='room-image-container'>
          <small>Doctor Image:</small>
          {uploadDoctorImgId === undefined || uploadDoctorImgId === null ? (
            <div className='no-room-image'>
              Upload
              <br /> Doctor Image
            </div>
          ) : (
            <img
              src={`${baseURL}${doctor.doctorImg}${uploadDoctorImgId}`}
              alt=''
              className='room-image'
            />
          )}
          <div className='form-input'>
            <input
              name='file'
              type='file'
              onChange={(e) => doctorPicHandler(e)}
            />
          </div>
          <button
            className='upload-btn'
            onClick={() => {
              const fd = new FormData();
              fd.append('file', file);
              uploadDoctorImg(fd);
            }}
          >
            Upload Image
          </button>
        </div>
        <form
          className='doctor-details-form'
          onSubmit={(e) => doctorSubmitHandler(e)}
        >
          <div className='form-grid'>
            <div className='form-left'>
              <div className='form-input'>
                <label htmlFor='name'>Full Name:</label>
                <input
                  name='name'
                  type='text'
                  value={doctorDetails.name}
                  onChange={(e) => doctorDetailsHandler(e)}
                />
              </div>
              <div className='form-input'>
                <label htmlFor='contactNo'>Contact Number:</label>
                <input
                  name='contactNo'
                  type='number'
                  value={doctorDetails.contactNo}
                  onChange={(e) => doctorDetailsHandler(e)}
                />
              </div>
              <div className='form-input'>
                <label htmlFor='speciality'>Speciality:</label>
                <input
                  name='speciality'
                  type='text'
                  value={doctorDetails.speciality}
                  onChange={(e) => doctorDetailsHandler(e)}
                />
              </div>
            </div>
            <div className='form-right'>
              <div className='form-input'>
                <label htmlFor='address'>Address:</label>
                <input
                  name='address'
                  type='text'
                  value={doctorDetails.address}
                  onChange={(e) => doctorDetailsHandler(e)}
                />
              </div>
              <div className='form-input'>
                <label htmlFor='education'>Education:</label>
                <input
                  name='education'
                  type='text'
                  value={doctorDetails.education}
                  onChange={(e) => doctorDetailsHandler(e)}
                />
              </div>
            </div>
          </div>
          <div className='form-btn-container'>
            <button type='submit' className='submit-btn'>
              Submit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowAddDoctor(false);
              }}
              className='cancel-btn'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorForm;
