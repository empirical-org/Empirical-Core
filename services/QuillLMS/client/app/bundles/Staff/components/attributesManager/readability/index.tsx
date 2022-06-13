import * as React from 'react'

import ActivityClassificationConversionChart from './activityClassificationConversionChart'

import { Snackbar, defaultSnackbarTimeout, Input } from '../../../../Shared/index'
import { requestGet, requestPut, requestPost, } from '../../../../../modules/request/index'

const baseUrl = "/cms/raw_scores/"

const RawScoreTableRow = ({ rawScore, saveRawScoreChanges, }) => {
  const [editing, setEditing] = React.useState(false)
  const [newName, setNewName] = React.useState(rawScore.name)

  function toggleEditing() {
    if (editing) {
      undoChange()
    }
    setEditing(!editing)
  }

  function onNameChange(e) {
    setNewName(e.target.value)
  }

  function undoChange() {
    setNewName(rawScore.name)
  }

  function handleSave() {
    saveRawScoreChanges(rawScore.id, { name: newName })
    toggleEditing()
  }

  if (editing) {
    return (
      <div className="raw-score-table-row">
        <Input handleCancel={undoChange} handleChange={onNameChange} value={newName} />
        <button className="interactive-wrapper" onClick={toggleEditing}>Cancel</button>
        <button className="quill-button fun contained primary" onClick={handleSave}>Save</button>
      </div>
    )
  }

  return (
    <div className="raw-score-table-row">
      <Input disabled={true} value={rawScore.name} />
      <button className="interactive-wrapper" onClick={toggleEditing}><i className="fas fa-edit" /> Edit</button>
    </div>
  )
}

const Readability = ({ match, location, }) => {
  const [rawScores, setRawScores] = React.useState([])
  const [activityClassificationConversionCharts, setActivityClassificationConversionCharts] = React.useState({})
  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [newRawScoreName, setNewRawScoreName] = React.useState('')

  React.useEffect(() => {
    getReadabilityData();
  }, []);

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  function getReadabilityData() {
    requestGet(baseUrl,
      (data) => {
        setRawScores(data.raw_scores);
        setActivityClassificationConversionCharts(data.activity_classification_conversion_charts)
      }
    )
  }

  function onChangeNewRawScoreName(e) {
    setNewRawScoreName(e.target.value)
  }

  function saveRawScoreChanges(id, rawScore) {
    requestPut(`${baseUrl}/${id}`, { raw_score: rawScore },
      (data) => {
        getReadabilityData()
        setShowSnackbar(true)
      }
    )
  }

  function createNewRawScore() {
    requestPost(baseUrl, { raw_score: { name: newRawScoreName, } },
      (data) => {
        getReadabilityData()
        setNewRawScoreName('')
        setShowSnackbar(true)
      }
    )
  }

  const conversionChartTables = Object.keys(activityClassificationConversionCharts).map(name => <ActivityClassificationConversionChart classificationName={name} conversionChart={activityClassificationConversionCharts[name]} />)
  const rawScoreTableRows = rawScores.map(rs => <RawScoreTableRow rawScore={rs} saveRawScoreChanges={saveRawScoreChanges} />)


  return (
    <div className="readability-manager">
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <div className="overall-raw-score-table-container">
        <h2>Overall Raw Score</h2>
        <div className="overall-raw-score-table">
          {rawScoreTableRows}
          <div className="new-raw-score-container">
            <Input handleChange={onChangeNewRawScoreName} label="Add Raw Score" value={newRawScoreName} />
            <button className="quill-button primary contained fun" onClick={createNewRawScore}>Add</button>
          </div>
        </div>
      </div>
      {conversionChartTables}
    </div>
  )
}

export default Readability
