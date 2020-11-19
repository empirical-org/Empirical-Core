import * as React from 'react'

const RawScore = ({ activity, rawScoreOptions, handleRawScoreChange, }) => {
  const [rawScoreEnabled, setRawScoreEnabled] = React.useState(!!activity.raw_score_id)
  const rawScoreOptionElements = [<option value={null} />].concat(rawScoreOptions.map(cpo => (<option value={cpo.id}>{cpo.name}</option>)))

  React.useEffect(() => {
    if (!rawScoreEnabled) {
      handleRawScoreChange(null)
    }
  }, [rawScoreEnabled])

  function onChangeRawScore(e) {
    handleRawScoreChange(e.target.value)
  }

  function toggleRawScoreEnabled(e) {
    setRawScoreEnabled(!rawScoreEnabled)
  }

  return (<section className="raw-score-container enabled-attribute-container">
    <section className="enable-raw-score-container checkbox-container">
      <input checked={rawScoreEnabled} onChange={toggleRawScoreEnabled} type="checkbox" />
      <label>Readability enabled</label>
    </section>
    <section>
      <label>Readability</label>
      <select disabled={!rawScoreEnabled} onChange={onChangeRawScore} value={activity.raw_score_id || ''}>{rawScoreOptionElements}</select>
    </section>
  </section>)
}

export default RawScore
