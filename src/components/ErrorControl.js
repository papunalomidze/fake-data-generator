import React from 'react';

const ErrorControl = ({ errors, onChange }) => {
  const handleChange = (e) => {
    let value = parseFloat(e.target.value);
    value = Math.min(value, 10000);
    onChange(value);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="input-group mb-3">
        <input type="number" className="form-control form-control-sm" min="0" max="10000" value={errors} onChange={handleChange} />
        <div className="input-group">
          <input type="range" className="form-range form-range-sm" min="0" max="10" step="0.2" value={errors} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default ErrorControl;
