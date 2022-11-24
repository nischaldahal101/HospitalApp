import React, { useReducer } from 'react';
import AdminContext from './AdminContext';
import AdminReducers from '../../reducers/AdminReducers';
import {
  ADMIN_LOGIN,
  ADMIN_LOGIN_FAILED,
  DELETE_ADMIN_PROFILE_PICTURE_FAILED,
  DELETE_EMERGENCY,
  DLT_NOTICE,
  GET_ADMIN_DATA,
  GET_ADMIN_DATA_FAILED,
  GET_EMERGENCIES,
  LOGOUT,
  READ_NOTICE,
  UPLOAD_ADMIN_PROFILE_PICTURE,
  UPLOAD_ADMIN_PROFILE_PICTURE_FAILED,
} from '../../actions/actionTypes';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import { endpoints } from '../../utils/endpoints';

const initialState = {
  adminDetails: '',
  adminProfileImgId: '',
  isLoading: true,
  emergencyData: null,
  isAuth: null,
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const baseURL = process.env.REACT_APP_API_KEY;

const AdminState = ({ children }) => {
  const [state, dispatch] = useReducer(AdminReducers, initialState);

  // login request to backend with admin data
  const loginAdmin = async (email, password) => {
    const body = JSON.stringify({
      email,
      password,
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post(
        `${baseURL}${endpoints.admin.adminlogin}`,
        body,
        config
      );

      dispatch({
        type: ADMIN_LOGIN,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.errors;

      console.log(error);

      dispatch({
        type: ADMIN_LOGIN_FAILED,
        payload: error,
      });
    }
  };

  // query admin data to the backend
  const queryAdminData = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`${baseURL}${endpoints.admin.queryAdmin}`);

      dispatch({
        type: GET_ADMIN_DATA,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.errors;

      dispatch({
        type: GET_ADMIN_DATA_FAILED,
        payload: error,
      });
    }
  };

  // upload admin profile picture
  const uploadAdminImg = async (fd, history) => {
    try {
      await axios.post(`${baseURL}${endpoints.admin.uploadAdminImg}`, fd);
      dispatch({
        type: UPLOAD_ADMIN_PROFILE_PICTURE,
      });
      history.push('/dashboard');
    } catch (err) {
      const error = err.response.data.msg;

      dispatch({
        type: UPLOAD_ADMIN_PROFILE_PICTURE_FAILED,
        payload: error,
      });
    }
  };

  // delete admin img
  const deleteAdminImg = async (id) => {
    try {
      await axios.delete(`${baseURL}${endpoints.admin.deleteAdminImg}${id}`);
    } catch (err) {
      const error = err.response.data.error;

      dispatch({
        type: DELETE_ADMIN_PROFILE_PICTURE_FAILED,
        payload: error,
      });
    }
  };

  //get all of the emergency data
  const getEmergencies = async () => {
    try {
      const res = await axios.get(
        `${baseURL}${endpoints.admin.getEmergencies}`
      );
      dispatch({
        type: GET_EMERGENCIES,
        payload: res.data,
      });
    } catch (err) {}
  };

  // delete emergency after resolve
  const deleteEmergency = async (_id) => {
    try {
      const res = await axios.delete(
        `${baseURL}${endpoints.admin.deleteEmergency}${_id}`
      );

      dispatch({
        type: DELETE_EMERGENCY,
        payload: res.data,
      });
    } catch (err) {}
  };

  //read emergency notification
  const readEmergency = async (_id) => {
    try {
      const res = await axios.put(
        `${baseURL}${endpoints.admin.readEmergency}${_id}`
      );

      dispatch({
        type: READ_NOTICE,
        payload: res.data,
      });
    } catch (error) {}
  };

  // dlt emergency notice
  const deleteEmNotice = async (_id) => {
    try {
      const res = await axios.delete(
        `${baseURL}${endpoints.admin.readEmergency}${_id}`
      );

      dispatch({
        type: DLT_NOTICE,
        payload: res.data,
      });
    } catch (err) {}
  };

  // logout admin
  const logout = async () => {
    dispatch({
      type: LOGOUT,
    });
  };

  return (
    <AdminContext.Provider
      value={{
        ...state,
        queryAdminData,
        uploadAdminImg,
        deleteAdminImg,
        loginAdmin,
        logout,
        getEmergencies,
        deleteEmergency,
        readEmergency,
        deleteEmNotice,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminState;
