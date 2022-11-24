import { useReducer } from 'react';
import DoctorContext from './DoctorContext';
import DoctorReducers from '../../reducers/DoctorReducers';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import {
  ADD_AVAILABLE_DATE,
  ADD_AVAILABLE_TIME,
  ADD_DOCTOR_DETAILS,
  ADD_DOCTOR_DETAILS_FAILED,
  DELETE_DOCTOR_FAILED,
  DLT_AVAILABLE_DATE,
  DLT_AVAILABLE_TIME,
  DLT_BOOKED_DATE,
  EDIT_DOCTOR_DETAILS,
  EDIT_ROOM_DETAILS_FAILED,
  GET_DOCTORS,
  GET_DOCTORS_FAILED,
  GET_DOCTOR_NUMBER,
  GET_DOCTOR_NUMBER_FAILED,
  GET_SINGLE_DOCTOR,
  GET_SINGLE_DOCTOR_FAILED,
  UPLOAD_DOCTOR_IMAGE,
  UPLOAD_DOCTOR_IMAGE_FAILED,
} from '../../actions/actionTypes';
import { endpoints } from '../../utils/endpoints';

const initialState = {
  totalDoctor: null,
  uploadDoctorImgId: null,
  doctorData: null,
  doctorSingleData: null,
  isLoading: true,
  isAuth: null,
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const baseURL = process.env.REACT_APP_API_KEY;
const doctors = endpoints.doctors;

const DoctorState = ({ children }) => {
  const [state, dispatch] = useReducer(DoctorReducers, initialState);

  // get total doctor number
  const getDoctorNumber = async () => {
    try {
      const res = await axios.get(`${baseURL}${doctors.getDoctorNumber}`);

      dispatch({
        type: GET_DOCTOR_NUMBER,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_DOCTOR_NUMBER_FAILED,
        payload: error,
      });
    }
  };

  // query backend for doctors data
  const queryDoctorData = async () => {
    try {
      const res = await axios.get(`${baseURL}${doctors.queryDoctor}`);

      dispatch({
        type: GET_DOCTORS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_DOCTORS_FAILED,
        payload: error,
      });
    }
  };

  // const query single doctor data
  const querySingleDoctor = async (_id) => {
    try {
      const res = await axios.get(
        `${baseURL}${doctors.querySingleDoctor}${_id}`
      );

      dispatch({
        type: GET_SINGLE_DOCTOR,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_SINGLE_DOCTOR_FAILED,
        payload: error,
      });
    }
  };

  // upload doctor image
  const uploadDoctorImg = async (fd) => {
    try {
      const res = await axios.post(`${baseURL}${doctors.uploadDoctorImg}`, fd);
      const { id } = res.data;
      let reqId = id;

      dispatch({
        type: UPLOAD_DOCTOR_IMAGE,
        payload: reqId,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: UPLOAD_DOCTOR_IMAGE_FAILED,
        payload: error,
      });
    }
  };

  // add doctor details
  const addDoctorDetails = async (doctorDetails, uploadDoctorImgId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { name, contactNo, speciality, address, education } = doctorDetails;

      const body = JSON.stringify({
        name,
        contactNo,
        address,
        education,
        speciality,
        uploadDoctorImgId,
      });
      const res = await axios.post(
        `${baseURL}${doctors.addDoctorDetails}`,
        body,
        config
      );

      dispatch({
        type: ADD_DOCTOR_DETAILS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: ADD_DOCTOR_DETAILS_FAILED,
        payload: error,
      });
    }
  };

  const editDoctorDetails = async (_id, doctorDetails, history) => {
    const { name, contactNo, speciality, address, education } = doctorDetails;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const body = JSON.stringify({
        name,
        contactNo,
        speciality,
        address,
        education,
      });

      const res = await axios.put(
        `${baseURL}${doctors.editDoctorDetails}${_id}`,
        body,
        config
      );

      dispatch({
        type: EDIT_DOCTOR_DETAILS,
        payload: res.data,
      });
      history.push('/doctors');
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: EDIT_ROOM_DETAILS_FAILED,
        payload: error,
      });
    }
  };

  // delete doctor from the array
  const deleteDoctor = async (_id, history) => {
    try {
      const id = _id;
      await axios.delete(`${baseURL}${doctors.deleteDoctor}${id}`);
      history.push('/doctors');
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: DELETE_DOCTOR_FAILED,
        payload: error,
      });
    }
  };

  // delete doctor booking info
  const deleteBookingInfo = async (id, _id) => {
    try {
      const res = await axios.delete(
        `${baseURL}${doctors.dltAvailable}${id}/booking/${_id}`
      );

      dispatch({
        type: DLT_BOOKED_DATE,
        payload: res.data,
      });
    } catch (err) {}
  };

  // add available time in that date
  const addTime = async (availableTime, _id, id) => {
    const { from, to } = availableTime;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ from, to });

      const res = await axios.post(
        `${baseURL}${doctors.available}${_id}/availabletime/${id}`,
        body,
        config
      );

      dispatch({
        type: ADD_AVAILABLE_TIME,
        payload: res.data,
      });
    } catch (err) {}
  };

  // delete the time
  const deleteTime = async (doctor_id, time_id, id) => {
    try {
      const res = await axios.delete(
        `${baseURL}${doctors.available}${doctor_id}/availabletime/${time_id}/${id}`
      );

      dispatch({
        type: DLT_AVAILABLE_TIME,
        payload: res.data,
      });
    } catch (err) {}
  };

  // add available date
  const addAvailableDate = async (_id, date) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ date });

      const res = await axios.post(
        `${baseURL}${doctors.available}${_id}/availableTime`,
        body,
        config
      );

      dispatch({
        type: ADD_AVAILABLE_DATE,
        payload: res.data,
      });
    } catch (err) {}
  };

  // delete the available date
  const dltAvailableDate = async (_id, id) => {
    try {
      const res = await axios.delete(
        `${baseURL}${doctors.available}${_id}/availableTime/${id}`
      );

      dispatch({
        type: DLT_AVAILABLE_DATE,
        payload: res.data,
      });
    } catch (err) {}
  };

  return (
    <DoctorContext.Provider
      value={{
        ...state,
        uploadDoctorImg,
        addDoctorDetails,
        getDoctorNumber,
        queryDoctorData,
        deleteDoctor,
        editDoctorDetails,
        querySingleDoctor,
        deleteBookingInfo,
        addTime,
        deleteTime,
        addAvailableDate,
        dltAvailableDate,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
};

export default DoctorState;
