import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import CountryDetails from './SearchCuntry';
import CountryMap from './mapClickSearch';

delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = () => {
  const [searchCountry, setSearchCountry] = useState('');
  const [mapCenter, setMapCenter] = useState([ 22.3511148, 78.6677428]);
  const [conuntrydata, setcountrydata] =useState()
  const [zoom, setZoom] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    var inpputval = event.target.name.value;
    setSearchCountry(inpputval)
    console.log(inpputval)
    
  };

  const fetchCountryGeolocation = async () => {
    setIsLoading(true);

    try {
    await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${searchCountry}&key=1ae388d8d9ae44f58cd16026e478ea96`
      )
      .then((responce)=> responce.data.results[0])
      .then((responce)=> {
        const {lat,lng} = responce.geometry
        setMapCenter([lat, lng])
        setcountrydata(responce)
        setZoom(30)
        console.log(responce.geometry)
      }
      )
      
    } catch (error) {
      console.error('Error fetching country geolocation:', error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    
    fetchCountryGeolocation();

  }, [searchCountry]); 

  console.log(conuntrydata)
  return (
    <div className="map-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
         name='name'
          placeholder="Enter a country"
        />
        <button type="submit">Search</button>
      </form>

      <div>
        
      
     <div>
      <div>
        <CountryDetails countryName={searchCountry}/>
      </div>
      
      <MapContainer center={mapCenter} zoom={zoom} maxBounds={[[-90, -180], [90, 180]]} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
              <Marker position={mapCenter}>
                <Popup>
                <h2>{conuntrydata.formatted}</h2>
                </Popup>
              </Marker>
        
            </MapContainer>
     </div>

      </div>
    </div>
  );
};

export default Map;
