import React, { useState } from 'react';
import Select from 'react-select';

const CheckboxList = ({ options }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const Option = ({ innerProps, label, data }) => (
    <div {...innerProps}>
      <input
        type="checkbox"
        onChange={() => handleChange(data)}
        checked={selectedOptions.some(option => option.value === data.value)}
      />
      {label}
    </div>
  );

  return (
    <Select
      options={options}
      isMulti
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Chọn các mục..."
      isSearchable
      components={{ Option }}
    />
  );
};

export default CheckboxList;
