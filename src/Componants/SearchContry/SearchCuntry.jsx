import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAsyncError } from 'react-router-dom';
import MapCountryDetails from '../MapShow/mapClickSearch';

const CountryDetails = ({ selectedCountry }) => {
if(selectedCountry){
  console.log(selectedCountry)
}else{
  console.log("flase")
  console.log(selectedCountry)
}

  return (
   <>
    <div style={{width:"50%", height:"100%", }}>
      
     {
      selectedCountry ?(
        <div>
          <h2>{selectedCountry.name}</h2>
          <img width="100px" height="60px" src={selectedCountry.flags[0]} alt={`${selectedCountry.name.common} flag`} />
         <p>Population: {selectedCountry.population}</p>
        </div>
      ):""
     }
      
    </div>
   </>
  );
};

export default CountryDetails;
