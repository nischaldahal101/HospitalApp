import {
  ADD_CATEGORY_DETAILS,
  GET_CATEGORIES_NUMBER,
  UPLOAD_CATEGORY_IMAGE,
  GET_CATEGORY,
  EDIT_CATEGORY_DETAILS,
  ADD_DISEASE_DETAILS,
  GET_SINGLE_CATEGORY,
  DLT_DIESEASE,
  ADD_AVAILABLE_DOC,
} from '../actions/actionTypes';

const CategoryReducer = (state, action) => {
  const { payload, type } = action;
  switch (type) {
    case GET_CATEGORIES_NUMBER:
      return {
        ...state,
        totalCategory: payload,
        isLoading: false,
      };
    case GET_CATEGORY:
      return {
        ...state,
        categoryData: payload,
        categorySingleData: null,
        isLoading: false,
      };
    case GET_SINGLE_CATEGORY:
    case ADD_DISEASE_DETAILS:
    case EDIT_CATEGORY_DETAILS:
    case DLT_DIESEASE:
    case ADD_AVAILABLE_DOC:
      return {
        ...state,
        categorySingleData: payload,
        isLoading: false,
      };

    case UPLOAD_CATEGORY_IMAGE:
      return {
        ...state,
        uploadCategoryImgId: payload,
        isLoading: false,
      };

    case ADD_CATEGORY_DETAILS:
      localStorage.setItem('categoryQty', payload.length);
      return {
        ...state,
        categoryData: payload,
        uploadCategoryImgId: null,
        isLoading: false,
      };

    default:
      return state;
  }
};

export default CategoryReducer;
