import React from 'react'
export default class extends React.Component {
  stateSpecificComponents = () => {
    if (this.props.status == 'trial') {
      return <h4>Success! You started your 30 day trial</h4>
    } else {
      return <h4>Success! You now have Premium</h4>
    }
  };

  render() {
    return (
      <div className='row new-sign-up-banner'>
        <div className='col-md-9 col-xs-12 pull-left'>
          {this.stateSpecificComponents()}
          <span>Now let’s save time grading and gain actionable insights.</span>
        </div>
        <div className='col-md-3 col-xs-12 pull-right'>
          <div className='premium-button-box text-center'>
            <a href='/teachers/progress_reports/concepts/students'><button className='button-green' type='button'>Check out Your Premium Student Results</button></a>
          </div>
        </div>
      </div>
    );
  }
}
