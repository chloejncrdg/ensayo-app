import React from 'react';

const Modal = ({ message }) => {
  return (
      <div className="bg-blue-800 py-3 px-5 rounded-sm shadow-lg">
        <p className="text-base font-sf-regular text-white">{message}</p>
      </div>
  );
};

export default Modal;