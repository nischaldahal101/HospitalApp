import React, { useState } from 'react';
import { AiOutlineUserAdd, AiFillThunderbolt } from 'react-icons/ai';
import { IoIosAddCircle } from 'react-icons/io';
import { MdPostAdd } from 'react-icons/md';
import { BsTwitter } from 'react-icons/bs';
import './dashboardactions.scss';
import Forms from '../Forms/Forms';
import Profile from '../../../assests/profile.jpg';

const DashboardActions = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddSuites, setShowAddSuites] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  return (
    <div className='dashboard-actions-container'>
      <div className='dashboard-actions'>
        <h3>
          <AiFillThunderbolt className='thunder-icon' />
          Dashboard Actions
        </h3>
        <div className='dashboard-btns-container'>
          <button
            className='add'
            onClick={() => {
              setShowAddDoctor(!showAddDoctor);
              setShowAddCategory(false);
              setShowAddSuites(false);
            }}
          >
            <AiOutlineUserAdd className='add-icon' />
            Add Doctor Details
          </button>
          <button
            className='add'
            onClick={() => {
              setShowAddSuites(!showAddSuites);
              setShowAddDoctor(false);
              setShowAddCategory(false);
            }}
          >
            <IoIosAddCircle className='add-icon' />
            Add Room Category
          </button>
          <button
            className='add'
            onClick={() => {
              setShowAddCategory(!showAddCategory);
              setShowAddDoctor(false);
              setShowAddSuites(false);
            }}
          >
            <MdPostAdd className='add-icon' />
            Add Checkup Category
          </button>{' '}
        </div>
        {showAddCategory || showAddDoctor || showAddSuites ? (
          <Forms
            showAddDoctor={showAddDoctor}
            setShowAddDoctor={setShowAddDoctor}
            showAddSuites={showAddSuites}
            setShowAddSuites={setShowAddSuites}
            showAddCategory={showAddCategory}
            setShowAddCategory={setShowAddCategory}
          />
        ) : (
          ''
        )}
      </div>
     
    </div>
  );
};

export default DashboardActions;
