import React, { useContext, useEffect } from 'react';
import './users.scss';
import Header from '../../../Navbar/Header';
import { Link } from 'react-router-dom';
import UserContext from '../../../../context/Users/UserContext';
import Spinner from '../../../Spinner/Spinner';
import { endpoints } from '../../../../utils/endpoints';
import StockImg from '../../../../assests/stock-image.jpg';

const baseURL = process.env.REACT_APP_API_KEY;
const users = endpoints.user;

const Users = () => {
  const { usersData, queryUsers } = useContext(UserContext);

  useEffect(() => {
    queryUsers();
  }, []);
  return (
    <div className='users-main-container'>
      <Header />
      <div className='users-main'>
        <div className='users-main-header'>
          <h2 className='main-header'>User's List</h2>
        </div>
        <Link to='/dashboard' className='go-back-link'>
          Go Back
        </Link>
        <div className='users-table-container'>
          {usersData === null ? (
            <div className='spinner-container'>
              <Spinner />
            </div>
          ) : (
            <>
              {usersData.length === 0 ? (
                <p className='no-users-text'>There are no any users.</p>
              ) : (
                <div className='users-container'>
                  {usersData.map((user) => {
                    const { _id, email, firstName, lastName, userImage } = user;
                    return (
                      <div className='single-user-main-container' key={_id}>
                        <div className='user'>
                          <Link
                            to={`/user/${_id}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <div className='room-img-container'>
                              {userImage ? (
                                <img
                                  src={`${baseURL}${users.userImg}${userImage}`}
                                  alt=''
                                  className='user-image'
                                />
                              ) : (
                                <img
                                  src={StockImg}
                                  alt=''
                                  className='stock-image'
                                />
                              )}
                            </div>
                          </Link>
                          <div className='room-details'>
                            <div className='room-txt-header'>
                              <p>
                                {firstName} {lastName}
                              </p>
                            </div>
                            <div className='room-txt'>
                              <p>{email}</p>
                            </div>
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
  );
};

export default Users;
