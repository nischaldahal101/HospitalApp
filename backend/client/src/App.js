import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import './app.scss';
import Login from './components/Login/Login';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminProfile from './components/Dashboard/AdminProfile/AdminProfile';
import Doctors from './components/Dashboard/DetailedView/Doctors/Doctors';
import Rooms from './components/Dashboard/DetailedView/Rooms/Rooms';
import Room from './components/Dashboard/DetailedView/Rooms/Room/Room';
import Categories from './components/Dashboard/DetailedView/Categories/Categories';
import Doctor from './components/Dashboard/DetailedView/Doctors/Doctor/Doctor';
import Category from './components/Dashboard/DetailedView/Categories/category/Category';
import Users from './components/Dashboard/DetailedView/Users/Users';
import User from './components/Dashboard/DetailedView/Users/User/User';
import ReportImage from './components/Dashboard/DetailedView/Users/User/UserReportImg/ReportImage';
import Emergency from './components/EmergencyMap/Emergency';
import EmergencyNotice from './components/Notifications/EmergencyNotice';

const App = () => {
  return (
    <div className='app-container'>
      <Router>
        <Route exact path='/' component={Login} />
        <Switch>
          <PrivateRoute exact path='/dashboard' component={Dashboard} />
          <PrivateRoute exact path='/adminprofile' component={AdminProfile} />
          <PrivateRoute exact path='/doctors' component={Doctors} />
          <PrivateRoute exact path='/rooms' component={Rooms} />
          <PrivateRoute exact path='/categories' component={Categories} />
          <PrivateRoute exact path='/room/:room_id' component={Room} />
          <PrivateRoute exact path='/doctor/:doctor_id' component={Doctor} />
          <PrivateRoute
            exact
            path='/category/:category_id'
            component={Category}
          />
          <PrivateRoute exact path='/users' component={Users} />
          <PrivateRoute exact path='/user/:user_id' component={User} />
          <PrivateRoute
            exact
            path='/user/:user_id/:image_id'
            component={ReportImage}
          />
          <PrivateRoute exact path='/emergency' component={Emergency} />
          <PrivateRoute
            exact
            path='/notifications'
            component={EmergencyNotice}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
