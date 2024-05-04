import React from 'react';

const SeedControl = ({ seed, onChange, onGenerateRandomSeed }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className="input-group mb-3">
        <input type="text" className="form-control form-control-sm" value={seed} onChange={e => onChange(e.target.value)} />
        <button className="btn btn-primary" type="button" onClick={onGenerateRandomSeed}>Generate Random Seed</button>
      </div>
    </div>
  );
};

export default SeedControl;
