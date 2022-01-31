import * as React from 'react'

const ContentPartners = ({ activity, contentPartnerOptions, handleContentPartnerChange, }) => {
  const [contentPartnerEnabled, setContentPartnerEnabled] = React.useState(!!activity.content_partner_ids.length)
  const contentPartnerOptionElements = contentPartnerOptions.map(cpo => (<option value={cpo.id}>{cpo.name}</option>))

  React.useEffect(() => {
    if (!contentPartnerEnabled) {
      handleContentPartnerChange([])
    }
  }, [contentPartnerEnabled])

  function onChangeContentPartner(e) {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    handleContentPartnerChange(selectedOptions)
  }

  function toggleContentPartnerEnabled(e) {
    setContentPartnerEnabled(!contentPartnerEnabled)
  }

  return (
    <section className="content-partner-container enabled-attribute-container">
      <section className="enable-content-partner-container checkbox-container">
        <input checked={contentPartnerEnabled} onChange={toggleContentPartnerEnabled} type="checkbox" />
        <label>Content partner enabled</label>
      </section>
      <section>
        <label>Content Partner</label>
        <select disabled={!contentPartnerEnabled} multiple onChange={onChangeContentPartner} value={activity.content_partner_ids}>{contentPartnerOptionElements}</select>
      </section>
    </section>
  )
}

export default ContentPartners
