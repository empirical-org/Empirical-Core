import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";
import { Row, Button } from "antd";

class Question extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
          showExample: true
        }

        this.toggleExample = this.toggleExample.bind(this)
    }

    toggleExample() {
      this.setState({showExample: !this.state.showExample})
    }

    topSection() {
      const meterWidth = 1/this.props.questions.length * 100
      return <div
        className="top-section"
        style={{
          padding: '20px 30px 10px',
          backgroundColor: '#ededed'
        }}
        >
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          >
          <h1>{this.props.activity.title}</h1>
          <div>
            <p>Sentences Completed: 0 of {this.props.questions.length}</p>
            <div className="progress-bar-indication">
              <span className="meter"
              style={{width: `${meterWidth}%`}}
            />
            </div>
        </div>
      </Row>
      <Row type="flex" align="middle" justify="flex-start">
        <Button onClick={this.toggleExample}>{this.state.showExample ? 'Hide Example' : 'Show Example'}</Button>
      </Row>
      </div>
    }

    render(): JSX.Element {
      return <div className="question">{this.topSection()}</div>
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapDispatchToProps)(Question);
