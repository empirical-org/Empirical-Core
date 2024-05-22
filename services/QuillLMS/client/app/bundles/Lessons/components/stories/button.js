import { action, storiesOf } from '@kadira/storybook'
import React from 'react'

storiesOf("Button", module)
  .add("with text", () => (
    <button onClick={action('clicked')}>My first Button</button>
  )
  )
