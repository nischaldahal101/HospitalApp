import React, { useContext, useEffect, useState } from 'react';
import Header from '../Navbar/Header';
import './dashboard.scss';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { FaBriefcaseMedical } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  MdAirlineSeatIndividualSuite,
  MdSupervisedUserCircle,
} from 'react-icons/md';
import DashboardActions from './Actions/DashboardActions';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import Logo from '../../assests/logo.png';
import { endpoints } from '../../utils/endpoints';

// context api part
import AdminContext from '../../context/Admin/AdminContext';
import DoctorContext from '../../context/Doctor/DoctorContext';
import CategoryContext from '../../context/Category/CategoryContext';
import RoomContext from '../../context/Room/RoomContext';
import UserContext from '../../context/Users/UserContext';

//baseURL
const baseURL = process.env.REACT_APP_API_KEY;
const admin = endpoints.admin;

const Dashboard = () => {
  const { queryAdminData, adminDetails, logout } = useContext(AdminContext);
  const { getDoctorNumber, totalDoctor } = useContext(DoctorContext);
  const { totalCategory, getCategoryNumber } = useContext(CategoryContext);
  const { totalRoom, getRoomNumber } = useContext(RoomContext);
  const { getUserNumber } = useContext(UserContext);

  const [showDropdown, setShowDropdown] = useState(false);

  // localstorage
  const roomQty = localStorage.getItem('roomQty');
  const doctorQty = localStorage.getItem('doctorQty');
  const categoryQty = localStorage.getItem('categoryQty');
  const userQty = localStorage.getItem('userQty');

  const handleLogout = () => {
    logout();
    console.log('loggedout');
  };

  useEffect(() => {
    queryAdminData();
    getRoomNumber();
    getDoctorNumber();
    getCategoryNumber();
    getUserNumber();
  }, []);
  const { fullname, position, profilePic } = adminDetails;

  return (
    <div>
      {adminDetails === '' ? (
        <Spinner size={120} />
      ) : (
        <div className='app-container'>
          <Header />
          <div className='dashboard-container'>
            <div className='dashboard-top-row'>
              <h2>Admin Panel</h2>
              <div className='logout-btn-container'>
                <BsThreeDotsVertical
                  className='three-dots'
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className='dropdown-container'>
                    <ul>
                      <li>
                        <div className='admin'>
                          <img
                            src={`${baseURL}${admin.adminImg}${profilePic}`}
                            alt=''
                            className='admin-img'
                          />
                          <div className='admin-headers'>
                            <h5>{fullname ? fullname : 'Admin Name'}</h5>
                            <small>
                              {position ? position : 'Admin Position'}
                            </small>
                            <p>
                              <Link
                                to={{
                                  pathname: '/adminprofile',
                                  fullname,
                                  position,
                                  profilePic,
                                }}
                                style={{
                                  textDecoration: 'none',
                                  color: '#105ed4',
                                }}
                              >
                                Edit Profile Image
                              </Link>
                            </p>
                          </div>
                        </div>
                      </li>
                      <li className='logout-btn-container'>
                        <button className='logout-btn' onClick={handleLogout}>
                          <RiLogoutBoxLine className='logout-btn-icon' />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className='dashboard-details-container'>
              <div className='display-grid'>
                <div className='database-details-container'>
                  <div className='users-container'>
                    <Link to='/users' style={{ textDecoration: 'none' }}>
                      <div className='headers'>
                        <MdSupervisedUserCircle className='icon' />
                        <div>
                          <strong>{userQty}</strong>
                          <p>Users</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className='doctors-container'>
                    <Link to='/doctors' style={{ textDecoration: 'none' }}>
                      <div className='headers'>
                        <FaBriefcaseMedical className='icon ' />
                        <div>
                          <strong>
                            {totalDoctor < doctorQty ? doctorQty : totalDoctor}
                          </strong>
                          <p>Doctors</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className='category-container'>
                    <Link to='/categories' style={{ textDecoration: 'none' }}>
                      <div className='headers'>
                        <BiCategory className='icon ' />
                        <div>
                          <strong>
                            {totalCategory < categoryQty
                              ? categoryQty
                              : totalCategory}
                          </strong>
                          <p>Categories</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className='suites-container'>
                    <Link to='/rooms' style={{ textDecoration: 'none' }}>
                      <div className='headers'>
                        <MdAirlineSeatIndividualSuite className='icon' />
                        <div>
                          <strong>
                            {totalRoom < roomQty ? roomQty : totalRoom}
                          </strong>
                          <p>Suites/Rooms</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className='logo-container'>
                  <img src={Logo} alt='' className='logo' />
                  <p>About Us</p>
                </div>
              </div>

              <DashboardActions />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
