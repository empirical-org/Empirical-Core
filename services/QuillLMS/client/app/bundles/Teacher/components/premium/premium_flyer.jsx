import React from 'react';

export default class extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="premium-flyer">
        <div className="inner-premium-flyer">
          <div className="content">
            <h1>Get Our Premium Flyer</h1>
            <p>To learn more about our Premium product, its features and benefits, you can download and print this one-page overview and share it with your school.</p>
            <a className="download-button" download="Quill Premium" href="https://assets.quill.org/documents/quill_premium.pdf"><i className="fas fa-file-pdf" />Download Premium PDF</a>
          </div>
          <div className="picture">
            <img alt="" src={`${process.env.CDN_URL}/images/shared/big_premium_flyer.png`} />
          </div>
        </div>
      </div>
    );
  }
}
