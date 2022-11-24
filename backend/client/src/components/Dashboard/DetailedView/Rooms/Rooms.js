import Spinner from '../../../Spinner/Spinner';
import React, { useEffect, useContext } from 'react';
import RoomContext from '../../../../context/Room/RoomContext';
import Header from '../../../Navbar/Header';
import { Link } from 'react-router-dom';
import { MdKingBed } from 'react-icons/md';
import { AiOutlineDollar } from 'react-icons/ai';
import { endpoints } from '../../../../utils/endpoints';
import './rooms.scss';

const baseURL = process.env.REACT_APP_API_KEY;
const rooms = endpoints.rooms;

const Rooms = () => {
  const { roomsData, queryRoomData } = useContext(RoomContext);

  useEffect(() => {
    queryRoomData();
  }, []);

  return (
    <div className='rooms-container'>
      <Header />
      <div className='rooms-main'>
        <div className='room-main-header'>
          <h2 className='main-header'>Room's List</h2>
        </div>
        <Link to='/dashboard' className='go-back-link'>
          Go Back
        </Link>
        <div className='rooms-table-container'>
          <div className='room-table-headers'>
            <h3>Available Rooms For Users To Book</h3>
            <small>
              Users can book these rooms while getting admit to our hospital.
            </small>
          </div>
          <div className='single-room-main-container'>
            {roomsData === null ? (
              <div className='spinner-container'>
                <Spinner />
              </div>
            ) : (
              <>
                {roomsData.length === 0 ? (
                  <p className='no-rooms-text'>
                    There are no any rooms. Please add some from dashboard.
                  </p>
                ) : (
                  <>
                    {roomsData.map((room) => {
                      const { _id, name, numberOfBed, price, roomImage } = room;
                      return (
                        <div className='single-room-container' key={_id}>
                          <div className='room'>
                            <Link
                              to={`/room/${_id}`}
                              style={{ textDecoration: 'none' }}
                            >
                              <div className='room-img-container'>
                                <img
                                  src={`${baseURL}${rooms.roomImg}${roomImage}`}
                                  className='room-img'
                                />
                              </div>
                            </Link>
                            <div className='room-details'>
                              <h4>{name}</h4>
                              <p>
                                <MdKingBed /> Number of Beds Available:{' '}
                                {numberOfBed}
                              </p>
                              <p>
                                <AiOutlineDollar /> Cost: Rs. {price}/Day
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
