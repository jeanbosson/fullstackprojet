import React from "react";

const Filter = ({ handleFilter, filterString }) => {
  return (
    <div>
      Filter with: <input onChange={handleFilter} value={filterString} />
    </div>
  );
};

export default Filter;
