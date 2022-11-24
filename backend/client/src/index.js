import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AdminState from './context/Admin/AdminState';
import DoctorState from './context/Doctor/DoctorState';
import CategoryState from './context/Category/CategoryState';
import RoomState from './context/Room/RoomState';
import UserState from './context/Users/UserState';

ReactDOM.render(
  <React.StrictMode>
    <AdminState>
      <DoctorState>
        <CategoryState>
          <RoomState>
            <UserState>
              <App />
            </UserState>
          </RoomState>
        </CategoryState>
      </DoctorState>
    </AdminState>
  </React.StrictMode>,
  document.getElementById('root')
);
