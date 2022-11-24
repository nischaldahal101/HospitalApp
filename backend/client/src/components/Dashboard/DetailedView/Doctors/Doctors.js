import React, { useContext, useEffect } from 'react';
import DoctorContext from '../../../../context/Doctor/DoctorContext';
import Header from '../../../Navbar/Header';
import './doctors.scss';
import { Link, withRouter } from 'react-router-dom';
import { AiOutlineBook } from 'react-icons/ai';
import { MdTune, MdOutlineLocationOn } from 'react-icons/md';
import { BsTelephoneFill } from 'react-icons/bs';
import Spinner from '../../../Spinner/Spinner';
import { endpoints } from '../../../../utils/endpoints';
import DoctorsSvg from '../../../../assests/doctors.svg';

const baseURL = process.env.REACT_APP_API_KEY;
const doctors = endpoints.doctors;

const Doctors = ({ history }) => {
  const { doctorData, queryDoctorData, deleteDoctor } =
    useContext(DoctorContext);

  useEffect(() => {
    queryDoctorData();
  }, []);

  return (
    <div className='doctors-container'>
      <Header />
      <div className='doctors-main'>
        <div className='doctors-main-header'>
          <h2>Doctor's List</h2>
        </div>
        <Link to='/dashboard' className='go-back-link'>
          Go Back
        </Link>
        <div className='doctors-table-container'>
          <div className='doctor-table-headers'>
            <h3>Our Respectable Doctors</h3>
            <small>
              Users can see these doctors details and book appointment with
              them.
            </small>
          </div>
          <div className='single-doctor-main-container'>
            {doctorData === null ? (
              <div className='spinner-container'>
                <Spinner />
              </div>
            ) : (
              <>
                {doctorData.length === 0 ? (
                  <div className='no-doctors-container'>
                    <p className='no-doctors-text'>
                      There are no any doctors. Please add some from dashboard.
                    </p>
                    <img src={DoctorsSvg} alt='' />
                  </div>
                ) : (
                  <div className='grid-doctors'>
                    {doctorData.map((doctor) => {
                      const {
                        _id,
                        name,
                        education,
                        contactNo,
                        doctorPic,
                        speciality,
                        address,
                      } = doctor;
                      return (
                        <div className='single-doctor-container' key={_id}>
                          <div className='doctor'>
                            <Link
                              to={`/doctor/${_id}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <div className='doctor-img-container'>
                                <img
                                  src={`${baseURL}${doctors.doctorImg}${doctorPic}`}
                                  className='doctor-img'
                                />
                              </div>
                            </Link>

                            <div className='doctor-details'>
                              <h4>{name}</h4>
                              <p>
                                <AiOutlineBook />
                                {education}
                              </p>
                              <p>
                                <MdTune /> {speciality}
                              </p>
                              <p>
                                <MdOutlineLocationOn /> {address}
                              </p>
                              <p style={{ paddingBottom: '.25em' }}>
                                <BsTelephoneFill /> {contactNo}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Doctors);
