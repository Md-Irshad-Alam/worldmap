import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import style from '../../index.css'

const CountryMap = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchedCountry, setSearchedCountry] = useState("india");
    const [countryname, setCountryname] = useState("india");
    const [mapCenter, setMapCenter] = useState([ 22.3511148, 78.6677428]);
   
  const mapRef = useRef(null);
  const [zoom, setzoom] = useState(6)
// handleclick function will take care for geting more details about the specific country 
// here pass argument "country " the whic contains country name 
  const handleCountryClick = async (country) => {
    
    
    try {
      const response = await axios.get(`https://restcountries.com/v3/name/${country}`);
      const countryData = response.data[0];
      console.log(countryData)
      // setting the data show country details
      setSelectedCountry(countryData);
      setCountryname(country)
    } catch (error) {
      console.error('Error fetching country details:', error);
    }
  };
//  this function is responsible for the when a api call the take one argument he for geting lat and lng value for the prevous
// when a user select the place on map the it will gives me lat and lng value 
  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;
    setMapCenter([lat, lng])
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=1ae388d8d9ae44f58cd16026e478ea96`);
      const countryName = response.data.results[0].components.country;
      handleCountryClick(countryName);
      setSearchedCountry(countryName);
        setzoom(13)
    } catch (error) {
      console.error('Error fetching country details:', error);
    }
  };

  useEffect(() => {
    // this map acctuly play the vital role for selecting the place on the map 
    const map = mapRef.current;
    console.log(map)
    if (map) {
      map.on('click', handleMapClick);
    }

    
  },[]);

  return (
    <div className='main-country-container'>
{/* for input box contianer */}
    <div className='input-box'> 
            <input
            type="text"
            value={searchedCountry}
            onChange={(e) => setSearchedCountry(e.target.value)}
            placeholder="Search for a country"
            />
            <button onClick={() => handleCountryClick(searchedCountry)}>Search</button>
        </div>  
{/* main container where both the part map and country details will rendered form here  */}
        <div className="mapAnddetails-container">
                <div className='country-details'>
            {
                selectedCountry && (
                <div className='inner-countrydetails'>
                    <h2>{selectedCountry.name.common}</h2>
                    <img width="100px" height="60px" src={selectedCountry.flags[0]} alt={`${selectedCountry.name.common} flag`} />
                    <p>Capital: {selectedCountry.capital[0]}</p>
                    <p>Curency: 
                        {` ${selectedCountry.currencies[Object.keys(selectedCountry.currencies)[0]].symbol}, 
                        ${Object.keys(selectedCountry.currencies)[0]} /
                         ,${selectedCountry.currencies[Object.keys(selectedCountry.currencies)[0]].name}`}
                    </p>
                    <p>Languages: 
                        {` ${selectedCountry.languages[Object.keys(selectedCountry.languages)[0]]},`}
                        {` ${selectedCountry.languages[Object.keys(selectedCountry.languages)[1]]},`}
                        {` ${selectedCountry.languages[Object.keys(selectedCountry.languages)[2]]},`}
                    </p>
                    <p>Area: {selectedCountry.area}</p>
                    <p>Capital: {selectedCountry.capital}</p>
                    <p>TimeZone : {selectedCountry.timezones[0]}</p>
                    <p>Region : {selectedCountry.region}</p>
                    <p>Population: {selectedCountry.population}</p>
                </div>
                )
            }
        </div>
   
                {/* map imeage  */}
        <div className='map-contaier-map'>
            <MapContainer ref={mapRef} center={[mapCenter[0], mapCenter[1]]} zoom={zoom} maxBounds={[[-90, -180], [90, 180]]} style={{ height: '300px', width: '63vw' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {selectedCountry && (
                <Marker position={selectedCountry.latlng}>
                    <Popup>
                    <h2>{selectedCountry.name.common}</h2>
                    <img width="100px" height="60px" src={selectedCountry.flags.svg} alt={`${selectedCountry.name.common} flag`} />
                    <p>Population: {selectedCountry.population}</p>
                                        </Popup>
                    </Marker>
                    )}
                </MapContainer>
            </div>
        </div>

    </div>
  );
};

export default CountryMap;
