import React, { useEffect, useContext } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import './emergency.scss';
import AdminContext from '../../context/Admin/AdminContext';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

const Emergency = () => {
  const { emergencyData, getEmergencies, deleteEmergency } =
    useContext(AdminContext);

  const markerIcon = new L.Icon({
    iconUrl:
      'https://i.pinimg.com/originals/33/d1/d1/33d1d16054d2a8edc3d83683464df3be.png',
    iconSize: [19, 19],
  });

  useEffect(() => {
    getEmergencies();
  }, []);

  return (
    <div className='emergency-main-container'>
      {emergencyData === null ? (
        <div className='spinner-container'>
          <Spinner />
        </div>
      ) : (
        <div className='emergency-container'>
          <MapContainer center={[27.6644, 85.318794]} zoom={12}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {emergencyData.map((x) => {
              return (
                <Marker
                  key={x._id}
                  position={[x.coordinates[0], x.coordinates[1]]}
                  icon={markerIcon}
                >
                  <Popup>
                    <Link
                      to={`/user/${x.user}`}
                      style={{ textDecoration: 'none' }}
                      target='_blank'
                    >
                      <strong>User Id:</strong> {x.user}
                    </Link>
                    <p>
                      <strong>Latitude:</strong> {x.coordinates[0]}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {x.coordinates[1]}
                    </p>
                    <button
                      className='dlt-emergency'
                      onClick={() => {
                        deleteEmergency(x._id);
                      }}
                    >
                      Delete Emergency
                    </button>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default Emergency;
