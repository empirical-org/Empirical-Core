import * as React from 'react'

import {
  IMMEDIATE,
  STAGGERED,
  baseDiagnosticImageSrc,
} from './shared'

import {
  infoIcon,
  Tooltip,
} from '../../../../../Shared/index'

const baseStaggeredReleaseSrc = `${baseDiagnosticImageSrc}/staggered_release`
const staggeredReleaseIllustrationGray = <img alt="" className="illustration" src={`${baseStaggeredReleaseSrc}/staggered_release_illustration_gray.svg`} />
const staggeredReleaseIllustrationGreen = <img alt="" className="illustration" src={`${baseStaggeredReleaseSrc}/staggered_release_illustration_green.svg`} />
const immediateReleaseIllustrationGray = <img alt="" className="illustration" src={`${baseStaggeredReleaseSrc}/immediate_release_illustration_gray.svg`} />
const immediateReleaseIllustrationGreen = <img alt="" className="illustration" src={`${baseStaggeredReleaseSrc}/immediate_release_illustration_green.svg`} />

type ReleaseMethodOptions = 'staggered'|'immediate'

interface ReleaseMethodModalProps {
  visible: boolean,
  handleClickAssign: () => {},
  handleClickCancel: () => {},
  setReleaseMethod: (releaseMethod: ReleaseMethodOptions) => {},
  releaseMethod?: ReleaseMethodOptions,
  originalReleaseMethod?: ReleaseMethodOptions
}

const ReleaseMethodOption = ({ isSelected, illustration, tooltipText, headerText, subheaderText, descriptionText, onClick, }) => {
  // disabling these rules for the div container because the behavior is handled by the button for keyboard users
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <div className={`release-method-option ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      {illustration}
      <h2>
        <button className="interactive-wrapper focus-on-light" onClick={onClick} type="button">{headerText}</button>
        <Tooltip
          tooltipText={tooltipText}
          tooltipTriggerText={<img alt={infoIcon.alt} src={infoIcon.src} />}
        />
      </h2>
      <p className="subheader">{subheaderText}</p>
      <p className="description">{descriptionText}</p>
    </div>
  )
  /* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
}

const ReleaseMethodModal = ({ visible, handleClickAssign, handleClickCancel, setReleaseMethod, releaseMethod, originalReleaseMethod, }: ReleaseMethodModalProps) => {
  function setReleaseMethodToStaggered() { setReleaseMethod(STAGGERED)}
  function setReleaseMethodToImmediate() { setReleaseMethod(IMMEDIATE)}

  if (!visible) { return <span /> }

  return (
    <div className="modal-container release-method-modal-container">
      <div className="modal-background" />
      <div className="release-method-modal quill-modal modal-body">
        <h1>How would you like to release activity packs to students?</h1>
        <div className="release-method-options">
          <ReleaseMethodOption
            descriptionText="Rather than assign all of the activity packs up front, you can choose to unlock only one activity pack at a time. Once students complete that pack, Quill will unlock the next activity pack in the sequence."
            headerText="Staggered Release"
            illustration={releaseMethod === STAGGERED ? staggeredReleaseIllustrationGreen : staggeredReleaseIllustrationGray}
            isSelected={releaseMethod === STAGGERED}
            onClick={setReleaseMethodToStaggered}
            subheaderText="Unlock selected activity packs one at a time"
            tooltipText="The benefit of this approach is that students don’t feel overwhelmed with too many assignments and it requires them to complete the activity packs in order."
          />
          <ReleaseMethodOption
            descriptionText="Students will see all of the activity packs you have assigned to them at once. You can choose to assign all of the recommendations at once, or you can select some of the packs to assign now and then come back to this page to assign additional packs at a later date. "
            headerText="Immediate Release"
            illustration={releaseMethod === IMMEDIATE ? immediateReleaseIllustrationGreen : immediateReleaseIllustrationGray}
            isSelected={releaseMethod === IMMEDIATE}
            onClick={setReleaseMethodToImmediate}
            subheaderText="Make all selected activity packs available at once"
            tooltipText="The benefit of this approach is that students can see all of their assignments at once, and they can choose which activities they want to work on."
          />
        </div>
        <div className="footer">
          <p className="footer-note">{originalReleaseMethod ? 'Note: Your selection will be applied to the entire class' : ''}</p>
          <div className="buttons-wrapper">
            <button className="quill-button large outlined secondary focus-on-light" onClick={handleClickCancel} type="button">Cancel</button>
            <button className={`quill-button large contained primary focus-on-light ${releaseMethod ? '' : 'disabled'}`} disabled={!releaseMethod} onClick={handleClickAssign} type="button">{originalReleaseMethod ? 'Save' : 'Assign'}</button>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ReleaseMethodModal
