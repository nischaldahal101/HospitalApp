import { useContext, useEffect, useState } from 'react';
import './user.scss';
import UserContext from '../../../../../context/Users/UserContext';
import Header from '../../../../Navbar/Header';
import Spinner from '../../../../Spinner/Spinner';
import StockImg from '../../../../../assests/stock-image.jpg';
import { endpoints } from '../../../../../utils/endpoints';
import { withRouter, Link } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_KEY;
const user = endpoints.user;

const User = ({ match, history }) => {
  const {
    querySingleUser,
    singleUserData,
    uploadUserReport,
    deleteUserReport,
  } = useContext(UserContext);
  const id = match.params.user_id;

  const [file, setFile] = useState(null);

  const userReportHanlder = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    querySingleUser(id);
  }, []);

  return (
    <div className='single-user-main'>
      <Header />
      <div className='single-user-container'>
        <div className='single-user-header'>
          <h2>User Details</h2>
        </div>
        {singleUserData === null ? (
          <div className='spinner-container'>
            <Spinner />
          </div>
        ) : (
          <div className='single-user-details'>
            <div className='user'>
              <div className='single-user-img-container'>
                {singleUserData.userImage ? (
                  <img
                    src={`${baseURL}${user.userImg}${singleUserData.userImage}`}
                    alt=''
                    className='user-image'
                  />
                ) : (
                  <img src={StockImg} alt='' className='stock-image' />
                )}
              </div>
              <div className='single-user-txt-container'>
                <div className='single-user-txt'>
                  <h2>
                    {singleUserData.firstName} {singleUserData.lastName}
                  </h2>
                </div>
                <div className='single-user-txt'>
                  <strong>Email : </strong>
                  <p>{singleUserData.email}</p>
                </div>
                <div className='single-user-txt'>
                  <strong>Gender : </strong>
                  <p>{singleUserData.gender}</p>
                </div>
                <div className='single-user-txt'>
                  <strong>Contact No : </strong>
                  <p>{singleUserData.contactNo}</p>
                </div>
                <div className='single-user-txt'>
                  <strong>Blood Group : </strong>
                  <p>{singleUserData.bloodGroup}</p>
                </div>
              </div>
            </div>
            <div className='user-reports'>
              <h3>User Reports</h3>
              {singleUserData.userReports.length === 0 ? (
                <strong>
                  There are no any reports uploaded for this user.
                </strong>
              ) : (
                <div className='grid-gallery'>
                  {singleUserData.userReports.map((report, index) => {
                    return (
                      <Link
                        to={`/user/${id}/${report}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div className='user-report-image-gallery' key={index}>
                          <img
                            src={`${baseURL}${user.getUserReport}${report}`}
                            alt=''
                            className='report-img'
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              <div className='form'>
                <div className='form-input'>
                  <label htmlFor='file'>Upload User Report :</label>
                  <input
                    type='file'
                    onChange={(e) => userReportHanlder(e)}
                    required
                  />
                </div>
                <button
                  onClick={() => {
                    const fd = new FormData();
                    fd.append('file', file);
                    uploadUserReport(fd, id, history);
                  }}
                  className='report-submit-btn'
                >
                  Upload Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withRouter(User);
