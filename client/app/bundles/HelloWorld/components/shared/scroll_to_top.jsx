import React from 'react'
import createReactClass from 'create-react-class'

export default class ScrollToTop extends React.Component {
  constructor() {
    super()
    window.scrollTo(0, 0)
  }

  render() {
    return null
  }
}
