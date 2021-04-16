import * as React from 'react'

import { requestGet } from '../../../../modules/request/index.js';
import { helpIcon, DropdownInput, } from '../../../Shared/index'

const KEY_METRICS_TIMEFRAME = 'keyMetricsTimeframe'
const YEARLY = 'yearly'
const WEEKLY = 'weekly'

const KeyMetric = ({ number, label, }) => (
  <div className="key-metric">
    <h4>{number}</h4>
    <span>{label}</span>
  </div>
)

const KeyMetrics = ({ firstName, }) => {
  const [metrics, setMetrics] = React.useState(null)
  const [loading, setLoading] = React.useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState(window.localStorage.getItem(KEY_METRICS_TIMEFRAME) || YEARLY)

  React.useEffect(() => {
    getMetrics();
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(KEY_METRICS_TIMEFRAME, selectedTimeframe)
  }, [selectedTimeframe])

  function getMetrics() {
    requestGet('/teacher_dashboard_metrics',
      (data) => {
        setMetrics(data);
        setLoading(false)
      }
    )
  }

  function onChangeSelectedTimeframe(e) { setSelectedTimeframe(e.value) }

  if (loading) { return <span /> }

  const timeframeOptions = [{ label: 'Yearly', value: YEARLY }, { label: 'Weekly', value: WEEKLY }]
  const selectedTimeframeOption = timeframeOptions.find(opt => opt.value === selectedTimeframe)

  return (<section className="key-metrics">
    <header>
      <h2>
        <span>{firstName}, here&#39;s your {selectedTimeframe} </span>
        <span className="no-break"><span>summary</span><a className="focus-on-light" href="https://app.intercom.com/a/apps/v2ms5bl3/articles/articles/5014089/show"><img alt={helpIcon.alt} src={helpIcon.src} /></a></span>
      </h2>
      <DropdownInput
        handleChange={onChangeSelectedTimeframe}
        label=''
        options={timeframeOptions}
        value={selectedTimeframeOption}
      />
    </header>
    <div className="key-metrics-wrapper">
      <KeyMetric label="Activities assigned" number={metrics[`${selectedTimeframe}_assigned_activities_count`]} />
      <KeyMetric label="Activities completed" number={metrics[`${selectedTimeframe}_completed_activities_count`]} />
    </div>
  </section>)

}

export default KeyMetrics
