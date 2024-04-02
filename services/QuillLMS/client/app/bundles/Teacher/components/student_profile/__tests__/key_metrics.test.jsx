import * as React from 'react';
import { render } from "@testing-library/react";

import KeyMetrics, { appendSIfPlural, formatTimespent, } from '../key_metrics';

const metrics = {
  day: {
    timespent: 100,
    activities_completed: 1
  },
  week: {
    timespent: 344,
    activities_completed: 3
  },
  month: {
    timespent: 1674,
    activities_completed: 13,
  },
  year: {
    timespent: 8159,
    activities_completed: 47
  }
}

describe('KeyMetrics component', () => {
  it('should render', () => {
    const { asFragment } = render(<KeyMetrics firstName="Emilia" metrics={metrics} />);
    expect(asFragment()).toMatchSnapshot();
  })
});

describe('appendSIfPlural', () => {
  it('should return an empty string for 1', () => {
    expect(appendSIfPlural(1)).toBe('');
  });

  it('should return "s" for numbers other than 1', () => {
    expect(appendSIfPlural(0)).toBe('s');
    expect(appendSIfPlural(2)).toBe('s');
    expect(appendSIfPlural(9999999)).toBe('s');
  });
});

describe('formatTimespent', () => {
  it('formats seconds to minutes', () => {
    expect(formatTimespent(300)).toBe('5 mins ');
  });

  it('formats seconds to hours and minutes', () => {
    expect(formatTimespent(3660)).toBe('1 hr 1 min ');
  });

  it('formats seconds to days, hours, and minutes', () => {
    expect(formatTimespent(90000)).toBe('1 day 1 hr ');
  });

  it('handles edge case of 0 seconds', () => {
    expect(formatTimespent(0)).toBe('0 mins');
  });

  it('rounds down durations not perfectly fitting into minutes or hours', () => {
    expect(formatTimespent(3601)).toBe('1 hr ');
  });
});
