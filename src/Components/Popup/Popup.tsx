import React, {ReactNode} from 'react';
import {RiCloseLine} from 'react-icons/ri';

import './Popup.modules.scss';

type PopupProps = {
  children: ReactNode;
  setShowAddForm: (isShown: boolean) => void;
  setShowEditForm: (isShown: boolean) => void;
  setShowDeleteForm: (isShown: boolean) => void;
  resetForm: () => void;
};

const Popup: React.FC<PopupProps> = ({
  children,
  setShowAddForm,
  setShowEditForm,
  setShowDeleteForm,
  resetForm,
}) => {
  function closePopup() {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowDeleteForm(false);
    resetForm();
  }

  return (
    <div className='popup'>
      <div className='popup-inner'>
        {children}
        <button className='popup-btn-close' onClick={closePopup}>
          <RiCloseLine />
        </button>
      </div>
    </div>
  );
};

export default Popup;
