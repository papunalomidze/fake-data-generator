import React from 'react';

const RegionSelect = ({ regions, selectedRegion, onChange }) => {
  return (
    <div className="d-flex justify-content-center">
      <select value={selectedRegion} onChange={onChange} className="form-control mb-4">
        {regions.map(region => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionSelect;
