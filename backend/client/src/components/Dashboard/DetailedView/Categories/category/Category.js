import React, { useContext, useState, useEffect } from 'react';
import './category.scss';
import Header from '../../../../Navbar/Header';
import { endpoints } from '../../../../../utils/endpoints';
import CategoryContext from '../../../../../context/Category/CategoryContext';
import DoctorContext from '../../../../../context/Doctor/DoctorContext';
import Spinner from '../../../../Spinner/Spinner';
import { Redirect, Link, withRouter } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import { GiHealthNormal } from 'react-icons/gi';
import { BsDot } from 'react-icons/bs';

const baseURL = process.env.REACT_APP_API_KEY;
const categories = endpoints.category;

const Category = ({ match, history }) => {
  const _id = match.params.category_id;

  const {
    editCategoryDetails,
    categorySingleData,
    addDisease,
    deleteDisease,
    querySingleCategory,
    deleteCategory,
    addDoctors,
    dltDoctor,
  } = useContext(CategoryContext);

  const { queryDoctorData, doctorData } = useContext(DoctorContext);

  // form states
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState({
    name: '',
    details: '',
  });
  const [diseaseDetails, setDiseaseDetails] = useState({
    diseaseName: '',
    diseaseDesc: '',
  });
  const [docDetails, setDocDetails] = useState({
    doctorId: '',
    doctorName: '',
  });

  const categoryDetailsHandler = (e) => {
    setCategoryDetails({ ...categoryDetails, [e.target.name]: e.target.value });
  };

  const diseaseDetailsHandler = (e) => {
    setDiseaseDetails({ ...diseaseDetails, [e.target.name]: e.target.value });
  };

  const categoryDetailsSubmit = (e) => {
    e.preventDefault();
    editCategoryDetails(_id, categoryDetails);
    setShowEdit(false);
  };

  const selectChangeHandler = (e) => {
    const reqDoc = doctorData.filter((x) => x._id === e.target.value);
    const doctorName = reqDoc[0].name;
    setDocDetails({ ...docDetails, doctorName, doctorId: e.target.value });
  };

  useEffect(() => {
    querySingleCategory(_id);
    queryDoctorData();
  }, []);

  if (_id === undefined || _id === null) {
    return <Redirect to='/categories' />;
  }
  return (
    <div className='single-category-containers'>
      <Header />
      <div className='single-category-main-container'>
        <div className='single-category-header'>
          <h2>Category Details</h2>
        </div>
        {categorySingleData === null ? (
          <div className='spinner-container'>
            <Spinner />
          </div>
        ) : (
          <div className='single-category-details'>
            <img
              src={`${baseURL}${categories.categoryImg}${categorySingleData.checkupIcon}`}
              alt='checkup'
              className='category-icon'
            />
            <div className='single-category-txt'>
              <h2>{categorySingleData.name}</h2>
              <p>{categorySingleData.details}</p>
              <div className='diseases-container'>
                <strong>Possible Diseases</strong>
                {categorySingleData.possibleDiseases.length === 0 ? (
                  <p>There are no diseases. Please add some.</p>
                ) : (
                  <>
                    {categorySingleData.possibleDiseases.map((disease) => (
                      <div className='disease' key={disease._id}>
                        <div className='disease-actions'>
                          <strong>{disease.diseaseName}</strong>
                          <button
                            className='delete-disease'
                            onClick={() => {
                              deleteDisease(
                                categorySingleData._id,
                                disease._id
                              );
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <p>{disease.diseaseDesc}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div
                className='available-doctors-container'
                style={{ marginTop: '.75em' }}
              >
                <strong>Available Doctors</strong>
                {categorySingleData.availableDoctors.length === 0 ? (
                  <p>
                    There are no doctors available for this category at the
                    moment. Please add some
                  </p>
                ) : (
                  <>
                    {categorySingleData.availableDoctors.map((doctor) => {
                      return (
                        <div className='available-doctors'>
                          <Link
                            to={`/doctor/${doctor.doctorId}`}
                            style={{ textDecoration: 'none' }}
                            key={doctor._id}
                          >
                            <p>
                              <BsDot />
                              {doctor.doctorName}
                            </p>
                          </Link>
                          <button
                            className='dlt-doctor'
                            onClick={() =>
                              dltDoctor(
                                categorySingleData._id,
                                doctor.doctorId,
                                history
                              )
                            }
                          >
                            Delete Doctor
                          </button>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <div className='category-btn-container'>
                <button
                  className='edit-category'
                  onClick={() => {
                    setShowEdit(true);
                    setShowAdd(false);
                    setShowAddDoc(false);
                  }}
                >
                  <FiEdit />
                  Edit Category
                </button>
                <button
                  className='add-disease'
                  onClick={() => {
                    setShowAdd(true);
                    setShowEdit(false);
                    setShowAddDoc(false);
                  }}
                >
                  <AiOutlineFileAdd />
                  Add Disease
                </button>
                <button
                  className='add-disease'
                  onClick={() => {
                    setShowAddDoc(true);
                    setShowAdd(false);
                    setShowEdit(false);
                  }}
                >
                  <GiHealthNormal />
                  Add Available Doctors
                </button>
                <button
                  className='delete-category'
                  onClick={() =>
                    deleteCategory(_id, categorySingleData.checkupIcon, history)
                  }
                >
                  <FaTrashAlt />
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        )}
        {showEdit && (
          <div className='show-form'>
            <form
              className='category-details-form'
              onSubmit={(e) => {
                categoryDetailsSubmit(e);
              }}
            >
              <h2>Edit Category Details </h2>
              <div className='form-grid'>
                <div className='form-left'>
                  <div className='form-input'>
                    <label htmlFor='name'>Category Name:</label>
                    <input
                      name='name'
                      type='text'
                      value={categoryDetails.name}
                      onChange={(e) => categoryDetailsHandler(e)}
                    />
                  </div>
                  <div className='form-input'>
                    <label htmlFor='speciality'>Category Details:</label>
                    <textarea
                      name='details'
                      type='text'
                      value={categoryDetails.details}
                      onChange={(e) => categoryDetailsHandler(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='form-btn-container'>
                <button className='submit-btn' type='submit'>
                  Submit
                </button>
                <button
                  className='cancel-btn'
                  type='submit'
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEdit(false);
                  }}
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
              className='category-details-form'
              onSubmit={(e) => {
                e.preventDefault();
                addDisease(_id, diseaseDetails);
                setShowAdd(false);
              }}
            >
              <h2>Add Disease Details </h2>
              <div className='form-grid'>
                <div className='form-left'>
                  <div className='form-input'>
                    <label htmlFor='name'>Disease Name:</label>
                    <input
                      name='diseaseName'
                      type='text'
                      value={diseaseDetails.diseaseName}
                      onChange={(e) => diseaseDetailsHandler(e)}
                    />
                  </div>
                  <div className='form-input'>
                    <label htmlFor='speciality'>Disease Description:</label>
                    <textarea
                      name='diseaseDesc'
                      type='text'
                      value={diseaseDetails.diseaseDesc}
                      onChange={(e) => diseaseDetailsHandler(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='form-btn-container'>
                <button className='submit-btn' type='submit'>
                  Submit
                </button>
                <button
                  className='cancel-btn'
                  type='submit'
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAdd(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {showAddDoc && (
          <div className='show-form'>
            <form
              className='category-details-form'
              onSubmit={(e) => {
                e.preventDefault();
                addDoctors(docDetails, categorySingleData._id);
                setShowAddDoc(false);
              }}
            >
              <h2>Add Available Doctor </h2>
              <div className='form-grid'>
                <div className='form-left'>
                  <div className='form-input'>
                    <label htmlFor='name'>Doctor Name:</label>
                    <select onChange={(e) => selectChangeHandler(e)}>
                      {doctorData.map((doctor) => {
                        return (
                          <option value={doctor._id} key={doctor._id}>
                            {doctor.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className='form-btn-container'>
                <button className='submit-btn' type='submit'>
                  Submit
                </button>
                <button
                  className='cancel-btn'
                  type='submit'
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddDoc(false);
                  }}
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

export default withRouter(Category);
