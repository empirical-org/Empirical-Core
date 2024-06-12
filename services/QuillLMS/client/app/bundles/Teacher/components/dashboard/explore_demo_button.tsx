import * as React from 'react'

const ExploreDemoButton = ({handleExploreDemoClick}) => (
  <div className="explore-demo">
    <button className="quill-button-archived contained primary medium" onClick={handleExploreDemoClick} type="button">Explore Demo Account</button>
  </div>
)

export default ExploreDemoButton
