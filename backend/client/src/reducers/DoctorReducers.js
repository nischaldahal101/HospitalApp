import {
  ADD_AVAILABLE_DATE,
  ADD_AVAILABLE_TIME,
  ADD_DOCTOR_DETAILS,
  DLT_AVAILABLE_DATE,
  DLT_AVAILABLE_TIME,
  DLT_BOOKED_DATE,
  EDIT_DOCTOR_DETAILS,
  GET_DOCTORS,
  GET_DOCTOR_NUMBER,
  GET_SINGLE_DOCTOR,
  UPLOAD_DOCTOR_IMAGE,
} from '../actions/actionTypes';

const DoctorReducers = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_DOCTOR_NUMBER:
      return {
        ...state,
        totalDoctor: payload,
        isLoading: false,
      };
    case GET_DOCTORS:
      return {
        ...state,
        doctorData: payload,
        doctorSingleData: null,
        isLoading: false,
      };

    case GET_SINGLE_DOCTOR:
      return {
        ...state,
        doctorSingleData: payload,
        isLoading: false,
      };
    case UPLOAD_DOCTOR_IMAGE:
      return {
        ...state,
        uploadDoctorImgId: payload,
        isAuth: true,
        isLoading: false,
      };

    case ADD_DOCTOR_DETAILS:
      localStorage.setItem('doctorQty', payload.length);
      return {
        ...state,
        doctorData: payload,
        uploadDoctorImgId: null,
        isLoading: false,
      };

    case EDIT_DOCTOR_DETAILS:
      return {
        ...state,
        doctorData: payload,
        isLoading: false,
      };

    case DLT_BOOKED_DATE:
      return {
        ...state,
        doctorSingleData: payload,
        isLoading: false,
      };

    case ADD_AVAILABLE_DATE:
      return {
        ...state,
        doctorSingleData: payload,
        isLoading: false,
      };

    case DLT_AVAILABLE_DATE:
      return {
        ...state,
        doctorSingleData: payload,
        isLoading: false,
      };
    case ADD_AVAILABLE_TIME:
      return {
        ...state,
        doctorSingleData: payload,
        isLoading: false,
      };

    case DLT_AVAILABLE_TIME:
      return {
        ...state,
        doctorSingleData: payload,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default DoctorReducers;
