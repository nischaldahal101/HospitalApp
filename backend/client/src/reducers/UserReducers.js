import {
  GET_SINLGE_USER,
  GET_USERS,
  GET_USERS_NUMBER,
} from '../actions/actionTypes';

const UserReducers = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USERS_NUMBER:
      localStorage.setItem('userQty', payload);
      return {
        ...state,
        totalUsers: payload,
      };
    case GET_USERS:
      return {
        ...state,
        usersData: payload,
        singleUserData: null,
        isLoading: false,
      };
    case GET_SINLGE_USER:
      return {
        ...state,
        singleUserData: payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default UserReducers;
