import { useReducer } from 'react';
import UserReducers from '../../reducers/UserReducers';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import { endpoints } from '../../utils/endpoints';
import UserContext from './UserContext';
import {
  GET_SINLGE_USER,
  GET_USERS,
  GET_USERS_NUMBER,
} from '../../actions/actionTypes';

const initalState = {
  totalUsers: null,
  usersData: null,
  singleUserData: null,
  isLoading: true,
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const baseURL = process.env.REACT_APP_API_KEY;
const users = endpoints.user;

const UserState = ({ children }) => {
  const [state, dispatch] = useReducer(UserReducers, initalState);

  // query total user
  const getUserNumber = async () => {
    try {
      const res = await axios.get(`${baseURL}${users.getUserNumber}`);

      dispatch({
        type: GET_USERS_NUMBER,
        payload: res.data,
      });
    } catch (err) {}
  };

  //query users data
  const queryUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}${users.getUsersData}`);

      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    } catch (err) {}
  };

  // query single user data
  const querySingleUser = async (id) => {
    try {
      const res = await axios.get(`${baseURL}${users.getSingleUser}${id}`);

      dispatch({
        type: GET_SINLGE_USER,
        payload: res.data,
      });
    } catch (err) {}
  };

  // upload user report
  const uploadUserReport = async (fd, id, history) => {
    try {
      await axios.post(`${baseURL}${users.uploadUserReport}${id}`, fd);
      history.push('/users');
    } catch (err) {}
  };

  // delete user report image
  const deleteUserReport = async (userId, imageId, history) => {
    try {
      await axios.delete(`${baseURL}${users.deleteUserReport}${imageId}`);
      await axios.delete(
        `${baseURL}${users.deleteUserReport}${userId}/${imageId}`
      );

      history.push(`/user/${userId}`);
    } catch (err) {}
  };

  return (
    <UserContext.Provider
      value={{
        ...state,
        getUserNumber,
        queryUsers,
        querySingleUser,
        uploadUserReport,
        deleteUserReport,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
