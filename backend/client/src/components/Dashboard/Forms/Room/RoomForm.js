import React, { useState, useContext, useEffect } from 'react';
import './roomform.scss';
import RoomContext from '../../../../context/Room/RoomContext';
import { endpoints } from '../../../../utils/endpoints';

const baseURL = process.env.REACT_APP_API_KEY;
const room = endpoints.rooms;

const RoomForm = ({ setShowAddSuites }) => {
  const { addRoomDetails, addRoomImage, uploadRoomImgId } =
    useContext(RoomContext);

  // room form
  const [roomDetails, setRoomDetails] = useState({
    name: '',
    numberOfBed: '',
    details: '',
    price: '',
    availableRooms: '',
  });
  const [file, setFile] = useState(null);

  const onChangeRoom = (e) => {
    setRoomDetails({ ...roomDetails, [e.target.name]: e.target.value });
  };
  const roomPicHanlder = (e) => {
    setFile(e.target.files[0]);
  };

  const roomSubmitHanlder = (e) => {
    e.preventDefault();
    addRoomDetails(roomDetails, uploadRoomImgId);
    setShowAddSuites(false);
  };

  return (
    <div className='form-doctor-container'>
      <h4>Add Room Category Details</h4>
      <div className='display-grid-form'>
        <div className='room-image-container'>
          <small>Room Image:</small>
          {uploadRoomImgId === null ? (
            <div className='no-room-image'>
              Upload
              <br /> Room Image
            </div>
          ) : (
            <img
              src={`${baseURL}${room.roomImg}${uploadRoomImgId}`}
              alt=''
              className='room-image'
            />
          )}
          <div className='form-input'>
            <input
              name='file'
              type='file'
              onChange={(e) => roomPicHanlder(e)}
            />
          </div>
          <button
            className='upload-btn'
            onClick={() => {
              const fd = new FormData();
              fd.append('file', file);
              addRoomImage(fd);
            }}
          >
            Upload Image
          </button>
        </div>
        <form
          className='doctor-details-form'
          onSubmit={(e) => roomSubmitHanlder(e)}
          encType='multipart/form-data'
          id='room-form'
        >
          <div className='form-grid'>
            <div className='form-left'>
              <div className='form-input'>
                <label htmlFor='name'>Room Type</label>
                <input
                  name='name'
                  value={roomDetails.name}
                  onChange={(e) => onChangeRoom(e)}
                  type='text'
                />
              </div>
              <div className='form-input'>
                <label htmlFor='details'>Details:</label>
                <textarea
                  name='details'
                  value={roomDetails.details}
                  onChange={(e) => onChangeRoom(e)}
                  type='text'
                />
              </div>
              <div className='form-input'>
                <label htmlFor='price'>Room Price:</label>
                <input
                  name='price'
                  value={roomDetails.price}
                  onChange={(e) => onChangeRoom(e)}
                  type='number'
                />
              </div>
              <div className='form-input'>
                <label htmlFor='numberOfBed'>Room Bed Quantity:</label>
                <input
                  name='numberOfBed'
                  value={roomDetails.numberOfBed}
                  onChange={(e) => onChangeRoom(e)}
                  type='number'
                />
              </div>{' '}
              <div className='form-input'>
                <label htmlFor='availableRooms'>Available Rooms:</label>
                <input
                  name='availableRooms'
                  value={roomDetails.availableRooms}
                  onChange={(e) => onChangeRoom(e)}
                  type='number'
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
                setShowAddSuites(false);
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

export default RoomForm;
