import React, { useState, useEffect } from 'react';
import RegionSelect from './RegionSelect';
import ErrorControl from './ErrorControl';
import SeedControl from './SeedControl';
import DataTable from './DataTable';
import seedrandom from 'seedrandom';
import lookupTables from './lookupTables'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function deleteCharacter(str) {
  if (str.length < 2) {
    return str;
  }
  const index = Math.floor(Math.random() * str.length);
  return str.slice(0, index) + str.slice(index + 1);
}

function addCharacter(str) {
  if (str.length > 50) {
    return str
  }
  const index = Math.floor(Math.random() * str.length);
  const charCode = Math.floor(Math.random() * 26) + 97;
  const charToAdd = String.fromCharCode(charCode);
  return str.slice(0, index) + charToAdd + str.slice(index);
}

function swapCharacters(str) {
  if (str.length < 2) {
    return str;
  }

  const index = Math.floor(Math.random() * (str.length - 1));
  const char1 = str.charAt(index);
  const char2 = str.charAt(index + 1);
  return str.slice(0, index) + char2 + char1 + str.slice(index + 2);
}

function applyRandomError(str, recordErrors, errors) {
  
  const errorTypes = [deleteCharacter, addCharacter, swapCharacters];
  let result = str;
    for (let i = 0; i < recordErrors; i++) {
      const randomErrorIndex = Math.floor(Math.random() * errorTypes.length);
      const randomError = errorTypes[randomErrorIndex];
      result = randomError(result);
    }
  return result;
}



const App = () => {
  const [selectedRegion, setSelectedRegion] = useState('Georgia');
  const [errors, setErrors] = useState(0);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10000).toString());
  const [fakeData, setFakeData] = useState([]);

  function generateFakeData(count, seed, selectedRegion, errors) {
    const rng = seedrandom(seed);
    const data = [];
    let generatedCount = 0;
    let errorCounter = 0;
  
    while (generatedCount < count) {
      
      const countryData = lookupTables[selectedRegion];
      const { cities, lastNames, middleNames, names, streets } = countryData;
      const city = cities[Math.floor(rng() * cities.length)];
      const lastName = lastNames[Math.floor(rng() * lastNames.length)];
      const firstName = names[Math.floor(rng() * names.length)];
      const street = streets[Math.floor(rng() * streets.length)];
      
      let name;
      if (selectedRegion === 'Georgia') {
        name = `${firstName} ${lastName}`.trim();
      } else {
        const middleName = middleNames[Math.floor(rng() * middleNames.length)];
        name = `${firstName} ${middleName} ${lastName}`.trim();
      }
      
      const country = selectedRegion;
      const identifier = Array.from({ length: 16 }, () => rng.int32().toString(36).charAt(1)).join('');
      let phoneNumberFormat;

      if (selectedRegion === 'Georgia') {
        phoneNumberFormat = rng() < 0.5 ? 'XXX-XX-XX-XX' : '(+995) XXX-XX-XX-XX';
      } else if (selectedRegion === 'Greece') {
        phoneNumberFormat = rng() < 0.5 ? 'XXX-XXXXXXX' : '(+30) XXX-XXXXXXX';
      } else if (selectedRegion === 'Germany') {
        phoneNumberFormat = rng() < 0.5 ? 'XXX-XXXXXXXXX' : '(+49) XXX-XXXXXXXXX';
      } else {
        phoneNumberFormat = 'XXXXXXXXXXX';
      }
  
      const phone = phoneNumberFormat.replace(/X/g, () => Math.floor(rng() * 10));
      const address = `${country}, ${city}, ${street}`;
  
      let nameWithError = name;
      let addressWithError = address;
  
      const nameErrors = Math.floor(errors / 2);
      const addressErrors = errors - nameErrors;
      if (errors === 0.5){
        const recordErrors = generatedCount % 2 === 0 ? 1 : 0;
  
        nameWithError = applyRandomError(nameWithError, recordErrors, errorCounter);
        addressWithError = applyRandomError(addressWithError, recordErrors, errorCounter);
        errorCounter += recordErrors;
  
      } else {
  
        for (let i = 0; i < nameErrors; i++) {
          nameWithError = applyRandomError(nameWithError, 1, errorCounter);
          errorCounter++;
        }
  
        for (let i = 0; i < addressErrors; i++) {
          addressWithError = applyRandomError(addressWithError, 1, errorCounter);
          errorCounter++;
        }
      }
      
      data.push({ id: generatedCount + 1, name: nameWithError, address: addressWithError, identifier, phone, errors });
      generatedCount++;
    }
  
    return data;
  }

  useEffect(() => {
    setFakeData(generateFakeData(20, seed, selectedRegion, errors));
  }, [seed, selectedRegion, errors]);


  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setFakeData(generateFakeData(fakeData.length, seed, e.target.value, errors));
  };
  
  const handleSeedChange = (value) => {
    setSeed(value);
    setFakeData(generateFakeData(fakeData.length, value, selectedRegion, errors));
  };
  

  const handleErrorsChange = (value) => {
    setErrors(value);
  };

  const handleGenerateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 10000);
    setSeed(randomSeed.toString());
    setFakeData(generateFakeData(fakeData.length, randomSeed.toString(), selectedRegion, errors));
  };
  

  const handleLoadMore = () => {
    const newData = generateFakeData(fakeData.length + 10, seed, selectedRegion, errors);
    setFakeData(newData);
  };

 
  
  return (
    <div className="container">
      <h1 className="text-center">Fake User Data Generator</h1>
      <div className="container-fluid">
        <div className="col-md-12">
          <div className="card">
              <h2 className="card-title d-flex justify-content-center align-items-center">Settings</h2>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <div className="form-group">
                    <label>Region:</label>
                    <RegionSelect regions={Object.keys(lookupTables)} selectedRegion={selectedRegion} onChange={handleRegionChange} />
                  </div>
                </div>
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <div className="form-group">
                    <label>Errors per Record:</label>
                    <ErrorControl errors={errors} onChange={handleErrorsChange} />
                  </div>
                </div>
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <div className="form-group">
                    <label>Seed:</label>
                    <SeedControl seed={seed} onChange={handleSeedChange} onGenerateRandomSeed={handleGenerateRandomSeed} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <DataTable data={fakeData} onLoadMore={handleLoadMore} className="small" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;