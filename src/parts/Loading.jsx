import React, { useState } from 'react';
import { Spin } from 'antd';

const Loader = () => {
  const [spinning, setSpinning] = useState(false);

  const showLoader = () => {
    setSpinning(true);
  };

  return (
    <div>
      <Spin spinning={spinning}>
      </Spin>
    </div>
  );
};

export default Loader;
