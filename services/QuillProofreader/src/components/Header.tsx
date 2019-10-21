import * as React from "react";
import { Layout, Row } from "antd";
import * as Redux from "redux";
import { connect } from "react-redux";
import '../styles/Header.scss'

import getParameterByName from '../helpers/getParameterByName';

import {
  updateSessionOnFirebase,
} from "../actions/session";

class Header extends React.Component<any, any> {
  constructor(props: any) {
    super(props)

    this.state = {
      firebaseSessionID: getParameterByName('student', window.location.href)
    }
  }

  goToLMS = () => {
    window.location.href = `${process.env.EMPIRICAL_BASE_URL}`
  }

  saveAndExit = () => {
    const { firebaseSessionID, } = this.state
    if (firebaseSessionID) {
      const { passage, } = this.props.session
      this.props.dispatch(updateSessionOnFirebase(firebaseSessionID, passage, this.goToLMS))
    } else {
      this.goToLMS()
    }
  }

  render() {
    return (
      <Layout.Header style={{
          height: '60px',
          width: "100%",
          backgroundColor: "#00c2a2",
          padding: "0 30px"}}>
          <Row type="flex" align="middle" justify="space-between" style={{height: '100%', maxWidth: '896px', margin: 'auto'}}>
            <img style={{ height: '25px' }} src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png" />
            <span style={{ color: 'white', cursor: 'pointer' }} onClick={this.saveAndExit}>Save & Exit</span>
          </Row>
        </Layout.Header>
    );
  }
};

const mapStateToProps = (state: any) => {
  return {
    session: state.session
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
      dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
