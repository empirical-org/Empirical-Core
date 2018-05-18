import * as React from "react";
import * as Redux from "redux";
import {connect} from "react-redux";

class Question extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
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
        <div style={{
          display: 'flex',
          alignItems: 'middle',
          justifyContent: 'space-between',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '56em'
        }}>
          <h1>{this.props.activity.title}</h1>
          <div>
            <p>Sentences Completed: 0 of {this.props.questions.length}</p>
            <div className="progress-bar-indication" style={{
              backgroundColor: "#f2f2f2",
              borderRadius: "6px",
              border: "1px solid #DDD",
              boxShadow: "inset 0 0 3px 0 rgba(115,115,115,.15)",
              margin: "0 auto",
              width: "100%",
              height: "10px"
            }}>
              <span className="meter"
              style={{
                width: `${meterWidth}%`,
                backgroundColor: "#00c2a2",
                border: "none",
                borderRadius: "0",
                height: "100%",
                display: "block"
              }}
            />
            </div>
        </div>
        </div>
      </div>
    }

    render(): JSX.Element {
      return this.topSection()
    }
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch: dispatch
    };
};

export default connect(mapDispatchToProps)(Question);
