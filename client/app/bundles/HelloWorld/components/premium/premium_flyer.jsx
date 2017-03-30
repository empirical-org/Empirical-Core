import React from 'react'

export default class extends React.Component{
  constructor(){
    super()
  }

  render(){
    return (
      <div className="premium-flyer">
        <div className="inner-premium-flyer">
          <div className="content">
            <h1>Get Our Premium Flyer</h1>
            <p>To learn more about our Premium product, its features and benefits, you can download and print this one-page overview and share it with your school.</p>
            <a className="download-button" href="http://d2t498vi8pate3.cloudfront.net/assets/Quill+Premium.pdf" download="Quill Premium"><i className="fa fa-file-pdf-o"/>Download Premium PDF</a>
          </div>
          <div className="picture">
            <img src="/images/big_premium_flyer.png"/>
          </div>
        </div>
      </div>
    )}
}
