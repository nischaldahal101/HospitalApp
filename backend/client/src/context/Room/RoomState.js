import { useReducer } from 'react';
import axios from 'axios';
import RoomReducers from '../../reducers/RoomReducers';
import RoomContext from './RoomContext';
import setAuthToken from '../../utils/setAuthToken';
import {
  ADD_ROOM_DETAILS,
  ADD_ROOM_DETAILS_FAILED,
  DELETE_ROOM_FAILED,
  DLT_ROOM_BOOKING,
  EDIT_ROOM_DETAILS,
  EDIT_ROOM_DETAILS_FAILED,
  GET_ROOMS,
  GET_ROOMS_FAILED,
  GET_ROOM_NUMBER,
  GET_ROOM_NUMBER_FAILED,
  GET_SINGLE_ROOM,
  GET_SINGLE_ROOM_FAILED,
  UPLOAD_ROOM_IMAGE,
  UPLOAD_ROOM_IMAGE_FAILED,
} from '../../actions/actionTypes';
import { endpoints } from '../../utils/endpoints';

const initialState = {
  totalRoom: null,
  uploadRoomImgId: null,
  roomsData: null,
  singleRoomData: null,
  isLoading: true,
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const baseURL = process.env.REACT_APP_API_KEY;
const rooms = endpoints.rooms;

const RoomState = ({ children }) => {
  const [state, dispatch] = useReducer(RoomReducers, initialState);

  //add room details
  const addRoomDetails = async (roomDetails, uploadRoomImgId) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { name, numberOfBed, details, price } = roomDetails;

      const body = JSON.stringify({
        name,
        numberOfBed,
        details,
        price,
        uploadRoomImgId,
      });

      const res = await axios.post(
        `${baseURL}${rooms.addRoomDetails}`,
        body,
        config
      );

      dispatch({
        type: ADD_ROOM_DETAILS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: ADD_ROOM_DETAILS_FAILED,
        payload: error,
      });
    }
  };

  //add room image
  const addRoomImage = async (fd) => {
    try {
      const res = await axios.post(`${baseURL}${rooms.addRoomImage}`, fd);
      const { id } = res.data;
      let reqId = id;
      dispatch({
        type: UPLOAD_ROOM_IMAGE,
        payload: reqId,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: UPLOAD_ROOM_IMAGE_FAILED,
        payload: error,
      });
    }
  };

  // get room number
  const getRoomNumber = async () => {
    try {
      const res = await axios.get(`${baseURL}${rooms.getRoomNumber}`);

      dispatch({
        type: GET_ROOM_NUMBER,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_ROOM_NUMBER_FAILED,
        payload: error,
      });
    }
  };

  //query room data
  const queryRoomData = async () => {
    try {
      const res = await axios.get(`${baseURL}${rooms.queryRoomData}`);
      dispatch({
        type: GET_ROOMS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_ROOMS_FAILED,
        payload: error,
      });
    }
  };

  // query single room data
  const querySingleRoom = async (_id) => {
    try {
      const res = await axios.get(`${baseURL}${rooms.querySingleRoom}${_id}`);

      dispatch({
        type: GET_SINGLE_ROOM,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_SINGLE_ROOM_FAILED,
        payload: error,
      });
    }
  };

  const editRoomDetails = async (_id, roomDetails) => {
    const { name, numberOfBed, details, price, availableRooms } = roomDetails;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({
        name,
        numberOfBed,
        details,
        price,
        availableRooms,
      });

      const res = await axios.put(
        `${baseURL}${rooms.editRoomDetails}${_id}`,
        body,
        config
      );

      dispatch({
        type: EDIT_ROOM_DETAILS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: EDIT_ROOM_DETAILS_FAILED,
        payload: error,
      });
    }
  };

  // delete room details
  const deleteRoomDetails = async (_id, history) => {
    try {
      await axios.delete(`${baseURL}${rooms.deleteRoom}${_id}`);

      history.push('/rooms');
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: DELETE_ROOM_FAILED,
        payload: error,
      });
    }
  };

  // delete room booking
  const deleteRoomBooking = async (_id, id) => {
    try {
      const res = await axios.delete(
        `${baseURL}${rooms.deleteBooking}${_id}/${id}}`
      );

      dispatch({
        type: DLT_ROOM_BOOKING,
        payload: res.data,
      });
    } catch (err) {}
  };

  return (
    <RoomContext.Provider
      value={{
        ...state,
        getRoomNumber,
        addRoomImage,
        addRoomDetails,
        queryRoomData,
        editRoomDetails,
        deleteRoomDetails,
        querySingleRoom,
        deleteRoomBooking,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomState;
