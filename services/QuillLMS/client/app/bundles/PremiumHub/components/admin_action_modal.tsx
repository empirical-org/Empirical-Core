import * as React from 'react';

import useModalAccessibility from '../../Shared/hooks/useModalAccessibility'

const AdminActionModal = ({ handleClickConfirm, handleCloseModal, headerText, bodyText, }) => {
  const { modalRef } = useModalAccessibility(handleCloseModal);

  return (
    <div className="modal-container admin-action-modal-container">
      <div className="modal-background" />
      <div
        aria-labelledby="modalTitle"
        aria-modal="true"
        className="admin-action-modal quill-modal"
        ref={modalRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="admin-action-modal-header">
          <h3 className="title" id="modalTitle">{headerText}</h3>
        </div>

        <div className="admin-action-modal-body modal-body">
          <p>{bodyText}</p>
        </div>

        <div className="admin-action-modal-footer">
          <div className="buttons">
            <button
              className="quill-button outlined secondary medium focus-on-light"
              onClick={handleCloseModal}
              type="button"
            >
              Cancel
            </button>
            <button
              className="quill-button contained primary medium focus-on-light"
              onClick={handleClickConfirm}
              type="button"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActionModal;
