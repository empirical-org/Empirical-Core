import * as React from 'react';

import { IMAGE_ALT_TEXT, IMAGE_ATTRIBUTION, IMAGE_CAPTION, IMAGE_LINK } from '../../../../../constants/evidence';
import { Input } from '../../../../Shared';

export const ImageSection = ({
  activityPassages,
  errors,
  handleSetImageLink,
  handleSetImageAltText,
  handleSetImageCaption,
  imageAttributionStyle,
  imageAttributionGuideLink,
  handleSetImageAttribution
}) => {
  return(
    <React.Fragment>
      <Input
        className="image-link-input"
        error={errors[IMAGE_LINK]}
        handleChange={handleSetImageLink}
        label="Image Link"
        value={activityPassages[0].image_link}
      />
      <Input
        className="image-alt-text-input"
        error={errors[IMAGE_ALT_TEXT]}
        handleChange={handleSetImageAltText}
        label="Image Alt Text"
        value={activityPassages[0].image_alt_text}
      />
      <Input
        className="image-caption-text-input"
        error={errors[IMAGE_CAPTION]}
        handleChange={handleSetImageCaption}
        label="Image Caption"
        value={activityPassages[0].image_caption}
      />
      {errors[IMAGE_CAPTION] && <p className="error-message">{errors[IMAGE_CAPTION]}</p>}
      <div className="image-attribution-container">
        <p className={`text-editor-label ${imageAttributionStyle}`} id="image-attribution-label"> Image Attribution</p>
        <a className="data-link image-attribution-guide-link" href={imageAttributionGuideLink} rel="noopener noreferrer" target="_blank">Image Attribution Guide</a>
        <textarea
          aria-labelledby="image-attribution-label"
          className="image-attribution-text-area"
          onChange={handleSetImageAttribution}
          value={activityPassages[0].image_attribution}
        />
      </div>
      {errors[IMAGE_ATTRIBUTION] && <p className="error-message">{errors[IMAGE_ATTRIBUTION]}</p>}
    </React.Fragment>
  );
}

export default ImageSection;
