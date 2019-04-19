import * as React from "react";
import { metrics } from "react-metrics";
import SegmentAnalytics from "../metrics/vendors/segment_analytics";


/* This is a traditionally-defined React HOC
 * It's meant to be called as withSegmentMetricsFunc(segmentKey)(WrappedComponent)
 * Given that we're hijacking `metrics` from `react-metrics`, this
 * ends up being a light wrapper that builds our config and attaches
 * our implementation of the Segment API
 */
function withSegmentMetricsFunc(segmentKey) {
  const metrics_config = {
    vendors: [{
      name: "Segment.io",
      api: new SegmentAnalytics({
        apiKey: segmentKey
      })
    }]
  }

  const metrics_options = {
    autoTrackPageView: false,
    useTrackBinding: false
  }

  return metrics(metrics_config, metrics_options);
}

/* Because rails-react passes data from the back-end through props
 * we need a version of the component wrapper that takes can strip
 * a prop for the segment write key for the current environment.
 */
function withSegmentMetricsProps(WrappedComponent) {
  class WrappedWithSegmentMetrics extends React.Component {
    constructor(props) {
      super(props);
      const { segmentKey } = props;
      this.wrappedComponent = withSegmentMetricsFunc(segmentKey)(WrappedComponent);
    }

    render() {
      const { segmentKey, ...passThroughProps } = this.props;
      return (
        <this.wrappedComponent {...passThroughProps} />
      );
    }
  }
  return WrappedWithSegmentMetrics  
}

export {
  withSegmentMetricsFunc,
  withSegmentMetricsProps,
};
