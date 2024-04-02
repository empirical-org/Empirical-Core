import * as React from "react" ;
import { render, screen, }  from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import { Tooltip } from '../../../../Shared/index';

describe('Tooltip component', () => {
  test('it should render when it is not searchable', () => {
    const { asFragment } = render(<Tooltip
      tooltipText="I am a tooltip"
      tooltipTriggerText="I have a lot of text"
    />);
    expect(asFragment()).toMatchSnapshot();
  })

  describe('when a list is passed in', () => {
    const tooltipTriggerText = "I am a tooltip trigger"

    const setup = () => {
      render(<Tooltip
        averageItemHeight={40}
        tooltipText={['Item One', 'Item Two', 'Item Three', 'Item Four', 'Item Five', 'Item Six', 'Item Seven', 'Item Eight', 'Item Nine', 'Item Ten', 'Item Eleven']}
        tooltipTriggerText={tooltipTriggerText}
      />);
      const user = userEvent.setup()

      return { user, }
    }

    test('it should render an entire list when it is not cut off', async () => {
      global.innerHeight = 2000;

      const { user, } = setup()

      const trigger = screen.getByText(tooltipTriggerText);

      await user.hover(trigger)

      expect(screen.getByText(/item eleven/i)).toBeTruthy()
    })

    test('it should render a partial list when it is cut off', async () => {
      global.innerHeight = 81;

      const { user, } = setup()

      const trigger = screen.getByText(tooltipTriggerText);

      await user.hover(trigger)

      expect(screen.queryByText(/item eleven/i)).not.toBeInTheDocument()
      expect(screen.getByText(/item one/i)).toBeInTheDocument()
      expect(screen.getByText(/and 10 more/i)).toBeInTheDocument()
    })
  })

})
