import React, { useContext, useState } from 'react';
import CategoryContext from '../../../../context/Category/CategoryContext';
import { endpoints } from '../../../../utils/endpoints';

const baseURL = process.env.REACT_APP_API_KEY;
const category = endpoints.category;

const CategoryForm = ({ setShowAddCategory }) => {
  const { uploadCategoryImgId, uploadCategoryIcon, addCategoryDetails } =
    useContext(CategoryContext);

  const [file, setFile] = useState(null);
  const checkupIconHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const [checkupDetails, setCheckupDetails] = useState({
    name: '',
    details: '',
  });
  const checkupDetailsHandler = (e) => {
    e.preventDefault();
    setCheckupDetails({ ...checkupDetails, [e.target.name]: e.target.value });
  };
  const checkUpDetailsSubmitHandler = (e) => {
    e.preventDefault();
    addCategoryDetails(checkupDetails, uploadCategoryImgId);
    setShowAddCategory(false);
  };

  return (
    <div className='form-doctor-container'>
      <h4>Add Check Up Category Details</h4>
      <div className='display-grid-form'>
        <div className='room-image-container'>
          <small>Category Icon:</small>
          {uploadCategoryImgId === undefined || uploadCategoryImgId === null ? (
            <div className='no-room-image'>
              Upload
              <br /> Category Icon
            </div>
          ) : (
            <img
              src={`${baseURL}${category.categoryImg}${uploadCategoryImgId}`}
              alt=''
              style={{ width: '150px', height: '150px' }}
            />
          )}
          <div className='form-input'>
            <input
              name='file'
              type='file'
              onChange={(e) => checkupIconHandler(e)}
            />
          </div>
          <button
            className='upload-btn'
            onClick={() => {
              const fd = new FormData();
              fd.append('file', file);
              uploadCategoryIcon(fd);
            }}
          >
            Upload Icon
          </button>
        </div>
        <form
          className='doctor-details-form'
          onSubmit={(e) => checkUpDetailsSubmitHandler(e)}
        >
          <div className='form-grid'>
            <div className='form-left'>
              <div className='form-input'>
                <label htmlFor='name'>Name of Category:</label>
                <input
                  name='name'
                  value={checkupDetails.name}
                  onChange={(e) => checkupDetailsHandler(e)}
                  type='text'
                />
              </div>
              <div className='form-input'>
                <label htmlFor='details'>Description: </label>
                <textarea
                  name='details'
                  type='text'
                  value={checkupDetails.details}
                  onChange={(e) => checkupDetailsHandler(e)}
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
                setShowAddCategory(false);
                e.preventDefault();
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

export default CategoryForm;
