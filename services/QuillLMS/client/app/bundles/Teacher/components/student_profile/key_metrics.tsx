import * as React from 'react'
import moment from 'moment'

import { DropdownInput, } from '../../../Shared/index'

const YEAR = 'year'
const MONTH = 'month'
const WEEK = 'week'
const DAY = 'day'

export function appendSIfPlural(number) {
  return number === 1 ? '' : 's'
}

export function formatTimespent(durationInSeconds) {
  const duration = moment.duration(durationInSeconds, 'seconds');
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  let durationString = ''

  durationString += days ? `${days} day${appendSIfPlural(days)} ` : ''
  durationString += hours ? `${hours} hr${appendSIfPlural(hours)} ` : ''
  durationString += minutes ? `${minutes} min${appendSIfPlural(minutes)} ` : ''

  if (durationString === '') { return '0 mins' }

  return durationString
}

const KeyMetric = ({ value, label, }) => (
  <div className="key-metric">
    <h4>{value}</h4>
    <span>{label}</span>
  </div>
)

const KeyMetrics = ({ firstName, metrics, }) => {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(YEAR)

  function onChangeSelectedTimeframe(e) { setSelectedTimeframe(e.value) }

  const timeframeOptions = [
    { label: 'Today', value: DAY },
    { label: 'This week', value: WEEK },
    { label: 'This month', value: MONTH },
    { label: 'This year', value: YEAR },
  ]

  const selectedTimeframeOption = timeframeOptions.find(opt => opt.value === selectedTimeframe)

  const timespent = metrics[selectedTimeframe]['timespent']
  const completedActivitiesCount = metrics[selectedTimeframe]['activities_completed']

  return (
    <section className="key-metrics">
      <header>
        <h2>
          <span>{firstName}, here&#39;s your summary for {selectedTimeframeOption.label.toLowerCase()}</span>
        </h2>
        <DropdownInput
          handleChange={onChangeSelectedTimeframe}
          label=''
          options={timeframeOptions}
          value={selectedTimeframeOption}
        />
      </header>
      <div className="key-metrics-wrapper">
        <KeyMetric label={`${completedActivitiesCount === 1 ? 'Activity' : 'Activities'} completed`} value={completedActivitiesCount?.toLocaleString()} />
        <KeyMetric label="Time spent" value={formatTimespent(timespent)} />
      </div>
    </section>
  )

}

export default KeyMetrics
