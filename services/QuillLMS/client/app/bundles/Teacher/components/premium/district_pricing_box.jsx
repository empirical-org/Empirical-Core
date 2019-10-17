import React from 'react'

export default class extends React.Component {

	constructor(){
		super()
	}

	render() {
    return (
      <div className="district-pricing-box flex-row vertically-centered space-between">
        <span>
          <span className='bold-segment'>Multiple schools or a district?</span>
				We provide group pricing, on-site training, and district dashboards.
        </span>
        <a className='q-button' href='https://quillconsultation.youcanbook.me' target="_blank">Request a Consultation</a>
      </div>
  	)}

}
