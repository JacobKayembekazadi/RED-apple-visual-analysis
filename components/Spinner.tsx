import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-1 rounded-full animate-spin" role="status" aria-label="Loading..."></div>
    </div>
  );
};

export default Spinner;