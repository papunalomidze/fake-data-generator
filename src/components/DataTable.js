import React, { useEffect, useRef } from 'react';

const DataTable = ({ data, onLoadMore }) => {
  const tableRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = tableRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      onLoadMore();
    }
  };

  useEffect(() => {
    tableRef.current.addEventListener('scroll', handleScroll);
    return () => {
      tableRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [onLoadMore]);

  return (
    <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }} ref={tableRef}>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Identifier</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td> 
              <td>{record.name}</td>
              <td>{record.identifier}</td>
              <td>{record.address}</td>
              <td>{record.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
