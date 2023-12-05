import * as React from 'react';
import { ContentState, EditorState } from 'draft-js';
import Dropzone from 'react-dropzone';

import { IMAGE_ALT_TEXT, IMAGE_ATTRIBUTION, IMAGE_CAPTION, IMAGE_LINK } from '../../../../../constants/evidence';
import { Input, TextEditor } from '../../../../Shared';
import getAuthToken from '../../../../Teacher/components/modules/get_auth_token';

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
  const [uploadedMediaLink, setUploadedMediaLink] = React.useState<string>(activityPassages[0].image_link);

  function handleDrop (acceptedFiles) {
    acceptedFiles.forEach(file => {
      const data = new FormData()
      data.append('file', file)
      fetch(`${process.env.DEFAULT_URL}/cms/images`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': getAuthToken()
        },
        body: data
      })
        .then(response => response.json()) // if the response is a JSON object
        .then(response => setUploadedMediaLink(response.url)); // Handle the success response object
    });
  }

  return(
    <React.Fragment>
      <div className="media-upload-container">
        <label>Click the square below or drag an image into it to upload an image or video:</label>
        <div className="dropzone-container"><Dropzone onDrop={handleDrop} /></div>
      </div>
      <Input
        className="image-link-input"
        error={errors[IMAGE_LINK]}
        handleChange={handleSetImageLink}
        label="Image Link"
        value={uploadedMediaLink}
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
        <TextEditor
          ContentState={ContentState}
          EditorState={EditorState}
          handleTextChange={handleSetImageAttribution}
          key="image-attribution"
          shouldCheckSpelling={true}
          text={activityPassages[0].image_attribution}
        />
      </div>
      {errors[IMAGE_ATTRIBUTION] && <p className="error-message">{errors[IMAGE_ATTRIBUTION]}</p>}
    </React.Fragment>
  );
}

export default ImageSection;
