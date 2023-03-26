import * as React from 'react'

import { DropdownInput, helpIcon, Tooltip } from '../../../Shared/index'

const KEY_METRICS_TIMEFRAME = 'keyMetricsTimeframe'
const YEARLY = 'yearly'
const WEEKLY = 'weekly'
const tooltipCopy = "These metrics include data from deleted activity packs. Deleted activity packs will not be displayed in any other report."

const KeyMetric = ({ number, label, }) => (
  <Tooltip
    tooltipText={tooltipCopy}
    tooltipTriggerText={(
      <div className="key-metric">
        <h4>{number}</h4>
        <span>{label}</span>
      </div>
    )}
  />
)

const KeyMetrics = ({ firstName, metrics, }) => {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(window.localStorage.getItem(KEY_METRICS_TIMEFRAME) || YEARLY)

  React.useEffect(() => {
    window.localStorage.setItem(KEY_METRICS_TIMEFRAME, selectedTimeframe)
  }, [selectedTimeframe])

  function onChangeSelectedTimeframe(e) { setSelectedTimeframe(e.value) }

  const timeframeOptions = [{ label: 'Yearly', value: YEARLY }, { label: 'Weekly', value: WEEKLY }]
  const selectedTimeframeOption = timeframeOptions.find(opt => opt.value === selectedTimeframe)

  const assignedActivitiesCount = metrics[`${selectedTimeframe}_assigned_activities_count`]
  const completedActivitiesCount = metrics[`${selectedTimeframe}_completed_activities_count`]

  return (
    <section className="key-metrics">
      <header>
        <h2>
          <span>{firstName}, here&#39;s your {selectedTimeframe} </span>
          <span className="no-break"><span>summary</span><a className="focus-on-light" href="https://support.quill.org/en/articles/5014089-how-are-the-metrics-on-the-teacher-home-page-calculated" rel="noopener noreferrer" target="_blank"><img alt={helpIcon.alt} src={helpIcon.src} /></a></span>
        </h2>
        <DropdownInput
          handleChange={onChangeSelectedTimeframe}
          label=''
          options={timeframeOptions}
          value={selectedTimeframeOption}
        />
      </header>
      <div className="key-metrics-wrapper">
        <KeyMetric label={`${assignedActivitiesCount === 1 ? 'Activity' : 'Activities'} assigned`} number={assignedActivitiesCount} />
        <KeyMetric label={`${completedActivitiesCount === 1 ? 'Activity' : 'Activities'} completed`} number={completedActivitiesCount} />
      </div>
    </section>
  )

}

export default KeyMetrics
