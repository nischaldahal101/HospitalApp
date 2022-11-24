import React, { useContext } from 'react';
import UserContext from '../../../../../../context/Users/UserContext';
import Header from '../../../../../Navbar/Header';
import './reportimage.scss';
import Spinner from '../../../../../Spinner/Spinner';
import { endpoints } from '../../../../../../utils/endpoints';
import { HiOutlineTrash } from 'react-icons/hi';
import { withRouter } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_KEY;
const user = endpoints.user;

const ReportImage = ({ match, history }) => {
  const imageId = match.params.image_id;
  const userId = match.params.user_id;

  const { deleteUserReport } = useContext(UserContext);

  return (
    <div className='report-image-container'>
      <Header />
      <div className='report-image'>
        <div className='report-image-header'>
          <h2>Image Details</h2>
        </div>
        {imageId === null ? (
          <Spinner />
        ) : (
          <div className='image-container'>
            <img src={`${baseURL}${user.getUserReport}${imageId}`} alt='' />
            <button
              className='dlt-report'
              onClick={() => {
                deleteUserReport(userId, imageId, history);
              }}
            >
              <HiOutlineTrash style={{ fontSize: '.9em' }} /> Delete Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(ReportImage);
