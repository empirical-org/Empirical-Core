import * as React from "react";
import { connect } from "react-redux";
import TurkLanding from './landing';

export class TurkerView extends React.Component<any, any> {

  render() {
    return(
      <div>
        <TurkLanding />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    activities: state.activities,
    session: state.session
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TurkerView);
