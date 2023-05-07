import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Popup from './Popup';

describe('Popup', () => {
  const setShowAddForm = jest.fn();
  const setShowEditForm = jest.fn();
  const setShowDeleteForm = jest.fn();
  const resetForm = jest.fn();

  const renderPopup = () =>
    render(
      <Popup
        setShowAddForm={setShowAddForm}
        setShowEditForm={setShowEditForm}
        setShowDeleteForm={setShowDeleteForm}
        resetForm={resetForm}
      >
        <h1>Popup Content</h1>
      </Popup>
    );

  it('renders Popup component', () => {
    renderPopup();
    expect(screen.getByText('Popup Content')).toBeInTheDocument();
  });

  it('closes the popup and resets form when the close button is clicked', () => {
    renderPopup();
    fireEvent.click(screen.getByLabelText('close'));

    expect(setShowAddForm).toHaveBeenCalledWith(false);
    expect(setShowEditForm).toHaveBeenCalledWith(false);
    expect(setShowDeleteForm).toHaveBeenCalledWith(false);
    expect(resetForm).toHaveBeenCalled();
  });
});
