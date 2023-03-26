import { marked } from 'marked';
import * as React from "react";
import stripHtml from "string-strip-html";

import { Modal, Tooltip } from '../../../Shared/index';

export const HeaderImage = ({ headerImage, passage }) => {

  const [imageUrlToVisit, setImageUrlToVisit] = React.useState<string>('');
  const [imageAttributionModalOpen, setImageAttributionModalOpen] = React.useState<boolean>(false);

  function handleStayClick() {
    setImageAttributionModalOpen(false);
  }

  function handleLeaveClick() {
    if (!imageUrlToVisit) {
      setImageAttributionModalOpen(false);
    }
    window.open(imageUrlToVisit, "_blank");
    setImageAttributionModalOpen(false);
  }

  function handleImageAttributionClick(e: any) {
    if(e.target.href) {
      e.preventDefault();
      setImageUrlToVisit(e.target.href);
      setImageAttributionModalOpen(true);
    }
  }

  function renderImageAttributionModal() {
    return(
      <Modal>
        <div className="leave-activity-warning-container">
          <p className="leave-activity-warning-header">Wait! Are you sure you want to leave?</p>
          <p className="leave-activity-warning-text">You are about to leave the activity. You will be taken to a different website.</p>
          <div className="button-container">
            <button className="stay-on-quill quill-button small secondary outlined focus-on-light" id="close-modal-button" onClick={handleLeaveClick} type="button">
              Yes, leave Quill
            </button>
            <button className="quill-button small primary contained focus-on-light" id="leave-activity-button" onClick={handleStayClick} type="button">
              Stay on Quill
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  const tooltipText = passage.image_attribution ? marked(passage.image_attribution) : '';

  return(
    <React.Fragment>
      {imageAttributionModalOpen && renderImageAttributionModal()}
      <section className="header-image-container">
        {headerImage}
        <section className="header-image-information">
          {passage.image_caption && <p className="header-image-caption">{stripHtml(passage.image_caption)}</p>}
          {passage.image_attribution && <Tooltip handleClick={handleImageAttributionClick} isTabbable={false} tooltipText={tooltipText} tooltipTriggerText="Image credit" tooltipTriggerTextClass="image-attribution-tooltip" />}
        </section>
      </section>
    </React.Fragment>
  );
}

export default HeaderImage;
