import React from 'react'

export default class ScrollToTop extends React.Component {
  constructor() {
    super()
    window.scrollTo(0, 0)
  }

  render() {
    return null
  }
}
