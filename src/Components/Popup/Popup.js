import React from 'react';
import {RiCloseLine} from 'react-icons/ri';

import './Popup.modules.scss';

const Popup = ({
  setIsPopupShown,
  children,
  setShowAddForm,
  setShowEditForm,
  setShowDeleteForm,
}) => {
  function closePopup() {
    setIsPopupShown(false);
    console.log('close');
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDeleteForm(false);
  }

  return (
    <div className='popup'>
      <div className='popup-inner'>
        {children}
        <button className='popup-btn-close' onClick={closePopup}>
          <RiCloseLine className='icon' />
        </button>
      </div>
    </div>
  );
};

export default Popup;
