import React from 'react';
import RoomForm from './Room/RoomForm';
import DoctorForm from './Doctor/DoctorForm';
import CategoryForm from './Category/CategoryForm';

const Forms = ({
  showAddDoctor,
  setShowAddDoctor,
  showAddSuites,
  setShowAddSuites,
  showAddCategory,
  setShowAddCategory,
}) => {
  return (
    <div className='forms-container'>
      {showAddDoctor && <DoctorForm setShowAddDoctor={setShowAddDoctor} />}
      {showAddSuites && <RoomForm setShowAddSuites={setShowAddSuites} />}
      {showAddCategory && (
        <CategoryForm setShowAddCategory={setShowAddCategory} />
      )}
    </div>
  );
};

export default Forms;
