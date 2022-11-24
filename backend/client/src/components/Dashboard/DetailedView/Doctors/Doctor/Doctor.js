import React, { useContext, useState, useEffect } from 'react';
import Header from '../../../../Navbar/Header';
import DoctorContext from '../../../../../context/Doctor/DoctorContext';
import { endpoints } from '../../../../../utils/endpoints';
import './doctor.scss';
import { AiOutlineBook } from 'react-icons/ai';
import { MdTune, MdOutlineLocationOn } from 'react-icons/md';
import { BsTelephoneFill } from 'react-icons/bs';
import { Redirect, withRouter, Link } from 'react-router-dom';
import Spinner from '../../../../Spinner/Spinner';
import { GrFormTrash } from 'react-icons/gr';

const baseURL = process.env.REACT_APP_API_KEY;
const doctors = endpoints.doctors;

const Doctor = ({ history, match }) => {
  const {
    editDoctorDetails,
    deleteDoctor,
    doctorSingleData,
    querySingleDoctor,
    deleteBookingInfo,
    addTime,
    deleteTime,
    addAvailableDate,
    dltAvailableDate,
  } = useContext(DoctorContext);
  const _id = match.params.doctor_id;

  const [showForm, setShowForm] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const [doctorDetails, setDoctorDetails] = useState({
    name: '',
    contactNo: '',
    speciality: '',
    address: '',
    education: '',
  });
  const [availableDate, setAvailableDate] = useState({
    date: '',
  });

  const [availableTime, setAvailableTime] = useState({
    from: '',
    to: '',
  });

  const timeChangeHandler = (e) => {
    setAvailableTime({
      ...availableTime,
      [e.target.name]: e.target.value,
    });
  };

  const doctorDetailsHandler = (e) => {
    setDoctorDetails({ ...doctorDetails, [e.target.name]: e.target.value });
  };

  const editFormSubmit = (e) => {
    e.preventDefault();
    editDoctorDetails(_id, doctorDetails, history);
  };

  useEffect(() => {
    querySingleDoctor(_id);
  }, []);

  if (_id === undefined || _id === null) {
    return <Redirect to='/doctors' />;
  }

  return (
    <div className='single-doctor-containers'>
      <Header />
      <div className='single-doctor-main-container'>
        <div className='single-doctor-header'>
          <h2>Doctor Details</h2>
        </div>
        {doctorSingleData === null ? (
          <div className='spinner-container'>
            <Spinner />
          </div>
        ) : (
          <div className='single-doctor-details'>
            <img
              src={`${baseURL}${doctors.doctorImg}${doctorSingleData.doctorPic}`}
              className='doctor-img'
              alt=''
            />
            <div className='single-doctor-txt'>
              <h2>{doctorSingleData.name}</h2>
              <p>
                <AiOutlineBook />
                {doctorSingleData.education}
              </p>
              <p>
                <MdTune />
                {doctorSingleData.speciality}
              </p>
              <p>
                <MdOutlineLocationOn /> {doctorSingleData.address}
              </p>

              <p style={{ paddingBottom: '.25em' }}>
                <BsTelephoneFill /> {doctorSingleData.contactNo}
              </p>
              <div className='available-time'>
                <strong>Available Time of {doctorSingleData.name}</strong>
                <div className='available-container'>
                  {doctorSingleData.available.length === 0 ? (
                    <p>
                      There is no available date/time for this doctor. Please
                      add some information.
                    </p>
                  ) : (
                    <>
                      {doctorSingleData.available.map((x) => {
                        return (
                          <div key={x._id} className='available'>
                            <h4>{x.date}</h4>
                            <small
                              onClick={(e) => {
                                e.preventDefault();
                                dltAvailableDate(_id, x._id);
                              }}
                            >
                              Delete Date
                            </small>
                            <div className='time-table'>
                              <div className='thead'>
                                <div>From Time</div>
                                <div>To Time</div>
                              </div>
                              <div className='tbody-container'>
                                {x.time.length === 0 ? (
                                  <p
                                    style={{
                                      borderBottom: '1px solid #105ed4',
                                    }}
                                  >
                                    There are no available time for this date.
                                  </p>
                                ) : (
                                  <>
                                    {x.time.map((y) => (
                                      <div className='tbody' key={y._id}>
                                        <div>{y.from}</div>
                                        <div
                                          style={{
                                            display: 'flex',
                                            gap: '.5em',
                                            alignItems: 'center',
                                          }}
                                        >
                                          {y.to}{' '}
                                          <button
                                            style={{
                                              border: 'none',
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => {
                                              deleteTime(_id, x._id, y._id);
                                            }}
                                          >
                                            <GrFormTrash />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            </div>
                            <form className='add-time-form'>
                              <h5>+ Add available Time For {x.date}</h5>
                              <div className='form-flex'>
                                <div className='form-control'>
                                  <label>From Time:</label>
                                  <input
                                    type='text'
                                    name='from'
                                    value={availableTime.from}
                                    onChange={(e) => timeChangeHandler(e)}
                                  />
                                </div>
                                <div className='form-control'>
                                  <label>To Time:</label>
                                  <input
                                    type='text'
                                    name='to'
                                    value={availableTime.to}
                                    onChange={(e) => timeChangeHandler(e)}
                                  />
                                </div>
                                <button
                                  className='add-time-btn'
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (
                                      availableTime.from === availableTime.to
                                    ) {
                                      window.alert(
                                        'From Time and To time cannot be same.'
                                      );
                                    } else {
                                      addTime(availableTime, _id, x._id);
                                      setAvailableTime({
                                        ...availableTime,
                                        from: '',
                                        to: '',
                                      });
                                    }
                                  }}
                                >
                                  Add Time
                                </button>
                              </div>
                            </form>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
                <div className='booked-time'>
                  <strong>Booked Date and Time Information</strong>
                  <div className='booked-container'>
                    {doctorSingleData.bookedDate.length === 0 ? (
                      <p>
                        There are no date/time booked by users for this doctor.
                      </p>
                    ) : (
                      <div className='single-book'>
                        {doctorSingleData.bookedDate.map((date) => {
                          return (
                            <div className='booked-single' key={date._id}>
                              <p>
                                <Link
                                  to={`/user/${date.bookedBy}`}
                                  style={{ textDecoration: 'none' }}
                                >
                                  <strong>Booked By:</strong> {date.bookedBy}
                                </Link>
                              </p>
                              <p>
                                <strong>Booked Date :</strong> {date.date}
                              </p>
                              <p>
                                <strong>Booked Time :</strong> {date.bookedTime}
                              </p>
                              <button
                                className='dlt-booked'
                                onClick={() => deleteBookingInfo(_id, date._id)}
                              >
                                Delete Booked Time/User
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='doctor-btn-container'>
                <button
                  className='edit-doctor'
                  onClick={() => {
                    setShowForm(true);
                    setShowAdd(false);
                  }}
                >
                  Edit Doctor Details
                </button>
                <button
                  className='edit-doctor'
                  onClick={() => {
                    setShowForm(false);
                    setShowAdd(true);
                  }}
                >
                  Add Doctor Available Time
                </button>
                <button
                  className='delete-doctor'
                  onClick={() => deleteDoctor(doctorSingleData._id, history)}
                >
                  Delete Doctor Details
                </button>
              </div>
            </div>
          </div>
        )}
        {showForm && (
          <div className='show-form'>
            <form
              className='doctor-details-form'
              onSubmit={(e) => {
                editFormSubmit(e);
                setShowForm(false);
              }}
            >
              <h2>Edit Doctor Details</h2>
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
                    <label htmlFor='speciality'>Speciality:</label>
                    <input
                      name='speciality'
                      type='text'
                      value={doctorDetails.speciality}
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
                </div>
                <div className='form-right'>
                  <div className='form-input'>
                    <label htmlFor='education'>Education:</label>
                    <input
                      name='education'
                      type='text'
                      value={doctorDetails.education}
                      onChange={(e) => doctorDetailsHandler(e)}
                    />
                  </div>
                  <div className='form-input'>
                    <label htmlFor='address'>Address:</label>
                    <input
                      name='address'
                      type='text'
                      value={doctorDetails.address}
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
                    setShowForm(false);
                  }}
                  className='cancel-btn'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {showAdd && (
          <div className='show-form'>
            <form
              className='doctor-details-form'
              onSubmit={(e) => {
                editFormSubmit(e);
                setShowForm(false);
              }}
            >
              <h2>Add Available Date</h2>
              <div className='form-grid'>
                <div className='form-left'>
                  <div className='form-input'>
                    <label htmlFor='name'>Date:</label>
                    <input
                      name='date'
                      type='date'
                      onChange={(e) =>
                        setAvailableDate({
                          ...availableDate,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className='form-btn-container'>
                <button
                  type='submit'
                  className='submit-btn'
                  onClick={(e) => {
                    e.preventDefault();
                    addAvailableDate(_id, availableDate.date);
                    setAvailableDate({ ...availableDate, date: '' });
                    setShowAdd(false);
                  }}
                >
                  Submit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAdd(false);
                  }}
                  className='cancel-btn'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(Doctor);
