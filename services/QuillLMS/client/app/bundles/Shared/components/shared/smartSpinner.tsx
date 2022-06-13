import * as React from 'react';

const spinner = 'https://assets.quill.org/images/icons/loader_still.svg';

class SmartSpinner extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.onMount) {
      this.props.onMount();
    }
  }

  render() {
    return (
      <div className="loading-spinner">
        <div className="spinner-container">
          <img alt="" className="spinner" src={spinner} />
          <p className="spinner-message">{this.props.message}</p>
        </div>
      </div>
    );
  }

}

export { SmartSpinner }
