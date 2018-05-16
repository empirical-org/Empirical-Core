import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dots: '', };
  }

  componentDidMount() {
    // setInterval(
    //   () => this.dots(),
    //   150
    // );
  }

  dots() {
    if (this.state.dots !== '...') {
      this.setState({ dots: `${this.state.dots}.`, });
    } else {
      this.setState({ dots: '', });
    }
  }

  render() {
    return (
      <span className="loading-dots">{this.props.loadingMessage + this.state.dots}</span>
    );
  }
}
