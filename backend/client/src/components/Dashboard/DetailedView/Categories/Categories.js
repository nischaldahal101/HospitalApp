import React, { useState, useContext, useEffect } from 'react';
import Header from '../../../Navbar/Header';
import './categories.scss';
import { Link } from 'react-router-dom';
import CategoryContext from '../../../../context/Category/CategoryContext';
import Spinner from '../../../Spinner/Spinner';
import { endpoints } from '../../../../utils/endpoints';

const baseURL = process.env.REACT_APP_API_KEY;
const categories = endpoints.category;

const Categories = () => {
  const { categoryData, queryCategoryData } = useContext(CategoryContext);

  useEffect(() => {
    queryCategoryData();
  }, []);

  return (
    <div className='categories-main-container'>
      <Header />
      <div className='categories-main'>
        <div className='categories-main-header'>
          <h2>Categories List</h2>
        </div>
        <Link to='/dashboard' className='go-back-link'>
          Go Back
        </Link>
        <div className='categories-table-container'>
          <div className='categories-table-headers'>
            <h3>Sumeru Hospital Popular Departments</h3>
            <small>
              Users can select between these categories to gain information
              about disease related to these categories.
            </small>
          </div>
          <div className='single-category-main-container'>
            {categoryData === null ? (
              <div className='spinner-container'>
                <Spinner />
              </div>
            ) : (
              <>
                {categoryData.length === 0 ? (
                  <p className='no-category-text'>
                    There are no any categories. Please add some from dashboard.
                  </p>
                ) : (
                  <>
                    {categoryData.map((category) => {
                      const { _id, name, checkupIcon } = category;
                      return (
                        <div className='single-category-container' key={_id}>
                          <Link
                            to={`/category/${_id}`}
                            style={{ textDecoration: 'none' }}
                          >
                            <div className='category'>
                              <div className='category-img-container'>
                                <img
                                  src={`${baseURL}${categories.categoryImg}${checkupIcon}`}
                                  className='category-img'
                                />
                              </div>
                              <div className='category-details'>
                                <p>{name}</p>
                              </div>
                            </div>
                          </Link>
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

export default Categories;
