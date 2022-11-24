import { useReducer } from 'react';
import CategoryContext from './CategoryContext';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import CategoryReducer from '../../reducers/CategoryReducer';
import {
  ADD_AVAILABLE_DOC,
  ADD_AVAILABLE_DOC_FAILED,
  ADD_CATEGORY_DETAILS,
  ADD_CATEGORY_DETAILS_FAILED,
  ADD_DISEASE_DETAILS,
  ADD_DISEASE_DETAILS_FAILED,
  DELETE_DISEASE_FAILED,
  DLT_DIESEASE,
  EDIT_CATEGORY_DETAILS,
  EDIT_CATEGORY_DETAILS_FAILED,
  GET_CATEGORIES_NUMBER,
  GET_CATEGORIES_NUMBER_FAILED,
  GET_CATEGORY,
  GET_CATEGORY_FAILED,
  GET_SINGLE_CATEGORY,
  GET_SINGLE_CATEGORY_FAILED,
  UPLOAD_CATEGORY_IMAGE,
  UPLOAD_CATEGORY_IMAGE_FAILED,
} from '../../actions/actionTypes';
import { endpoints } from '../../utils/endpoints';

const initalState = {
  totalCategory: null,
  uploadCategoryImgId: null,
  categoryData: null,
  isLoading: true,
  singleCategory: null,
  categorySingleData: null,
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const baseURL = process.env.REACT_APP_API_KEY;

const category = endpoints.category;

const CategoryState = ({ children }) => {
  const [state, dispatch] = useReducer(CategoryReducer, initalState);

  // get category total
  const getCategoryNumber = async () => {
    try {
      const res = await axios.get(`${baseURL}${category.categoryNumber}`);

      dispatch({
        type: GET_CATEGORIES_NUMBER,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_CATEGORIES_NUMBER_FAILED,
        payload: error,
      });
    }
  };

  // query server for category data
  const queryCategoryData = async () => {
    try {
      const res = await axios.get(`${baseURL}${category.queryCategoryData}`);

      dispatch({
        type: GET_CATEGORY,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_CATEGORY_FAILED,
        payload: error,
      });
    }
  };

  // query single checkup
  const querySingleCategory = async (_id) => {
    try {
      const res = await axios.get(
        `${baseURL}${category.querySingleCategoryData}${_id}`
      );

      dispatch({
        type: GET_SINGLE_CATEGORY,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: GET_SINGLE_CATEGORY_FAILED,
        payload: error,
      });
    }
  };

  // upload category icon
  const uploadCategoryIcon = async (fd) => {
    try {
      const res = await axios.post(
        `${baseURL}${category.uploadCategoryIcon}`,
        fd
      );

      const { id } = res.data;
      let reqId = id;

      dispatch({
        type: UPLOAD_CATEGORY_IMAGE,
        payload: reqId,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: UPLOAD_CATEGORY_IMAGE_FAILED,
        payload: error,
      });
    }
  };

  // add category details
  const addCategoryDetails = async (checkupDetails, uploadCategoryImgId) => {
    const { name, details } = checkupDetails;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ name, details, uploadCategoryImgId });

      const res = await axios.post(
        `${baseURL}${category.addCategoryDetails}`,
        body,
        config
      );

      dispatch({
        type: ADD_CATEGORY_DETAILS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: ADD_CATEGORY_DETAILS_FAILED,
        payload: error,
      });
    }
  };

  // edit category details
  const editCategoryDetails = async (_id, categoryDetails) => {
    const { name, details } = categoryDetails;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ name, details });

      const res = await axios.put(
        `${baseURL}${category.editCategoryDetails}${_id}`,
        body,
        config
      );

      dispatch({
        type: EDIT_CATEGORY_DETAILS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: EDIT_CATEGORY_DETAILS_FAILED,
        payload: error,
      });
    }
  };

  // delete category
  const deleteCategory = async (_id, checkupIcon, history) => {
    try {
      await axios.delete(`${baseURL}${category.deleteCategoryDetails}${_id}`);
      await axios.delete(
        `${baseURL}${category.deleteCategoryImage}${checkupIcon}`
      );
      history.push('/categories');
    } catch (err) {}
  };

  // add disease details to checkup category
  const addDisease = async (id, diseaseDetails) => {
    const { diseaseName, diseaseDesc } = diseaseDetails;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ diseaseName, diseaseDesc });

      const res = await axios.put(
        `${baseURL}${category.addDisease}${id}/disease`,
        body,
        config
      );

      dispatch({
        type: ADD_DISEASE_DETAILS,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: ADD_DISEASE_DETAILS_FAILED,
        payload: error,
      });
    }
  };

  // delete disease
  const deleteDisease = async (id, _id) => {
    try {
      const res = await axios.delete(
        `${baseURL}${category.deleteDiease}/${id}/disease/${_id}`
      );
      dispatch({
        type: DLT_DIESEASE,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: DELETE_DISEASE_FAILED,
        payload: error,
      });
    }
  };

  // add available doctors to the category
  const addDoctors = async (docDetails, _id) => {
    const { doctorName, doctorId } = docDetails;
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ doctorId, doctorName });

      const res = await axios.put(
        `${baseURL}${category.addAvailableDoc}${_id}/doctor`,
        body,
        config
      );

      dispatch({
        type: ADD_AVAILABLE_DOC,
        payload: res.data,
      });
    } catch (err) {
      const error = err.response.data.error;
      dispatch({
        type: ADD_AVAILABLE_DOC_FAILED,
        payload: error,
      });
    }
  };

  // delete doctor from the available doctors
  const dltDoctor = async (_id, doctorId, history) => {
    try {
      await axios.delete(
        `${baseURL}${category.addAvailableDoc}${_id}/doctor/${doctorId}`
      );
      history.push('/categories');
    } catch (err) {}
  };

  return (
    <CategoryContext.Provider
      value={{
        ...state,
        uploadCategoryIcon,
        addCategoryDetails,
        getCategoryNumber,
        queryCategoryData,
        editCategoryDetails,
        addDisease,
        deleteDisease,
        querySingleCategory,
        deleteCategory,
        addDoctors,
        dltDoctor,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
