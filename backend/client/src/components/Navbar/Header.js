import React from 'react';
import { Link } from 'react-router-dom';
import './header.scss';
import Logo from '../../assests/logo.png';
import { GrMonitor } from 'react-icons/gr';
import {
  MdSupervisedUserCircle,
  MdBedroomParent,
  MdEmergency,
} from 'react-icons/md';
import { GiHealthNormal } from 'react-icons/gi';
import { BiCategory, BiNotification } from 'react-icons/bi';

const Header = () => {
  return (
    <div className='navbar-container'>
      <div className='navbar-header'>
        <img src={Logo} alt='' className='logo' />
      </div>
      <div className='navbar-links'>
        <Link to='/dashboard' className='react-router-links'>
          <GrMonitor />
          Dashboard
        </Link>
        <Link to='/users' className='react-router-links'>
          <MdSupervisedUserCircle /> Users
        </Link>
        <Link to='/categories' className='react-router-links'>
          <BiCategory /> Categories
        </Link>
        <Link to='/doctors' className='react-router-links'>
          <GiHealthNormal /> Doctors
        </Link>
        <Link to='/rooms' className='react-router-links'>
          <MdBedroomParent /> Rooms
        </Link>
        <Link to='/notifications' className='react-router-links'>
          <BiNotification /> Notifications
        </Link>
        <Link to='/emergency' className='react-router-links'>
          <MdEmergency /> Emergency
        </Link>
      </div>
    </div>
  );
};

export default Header;
