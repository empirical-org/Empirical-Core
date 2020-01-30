import * as React from "react";
import { Layout, Row } from "antd";
import * as Redux from "redux";
import { connect } from "react-redux";
import '../styles/Header.scss'

import getParameterByName from '../helpers/getParameterByName';

const quillLogoSrc = `${process.env.QUILL_CDN_URL}/images/logos/quill-logo-white.svg`

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

  handleSaveAndExitClick = () => {
    const { session, dispatch, } = this.props
    const { firebaseSessionID, } = this.state
    if (firebaseSessionID) {
      const { passage, } = session
      dispatch(updateSessionOnFirebase(firebaseSessionID, passage, this.goToLMS))
    } else {
      this.goToLMS()
    }
  }

  render() {
    return (
      <Layout.Header style={{
          height: '64px',
          width: "100%",
          backgroundColor: "#06806b",
          padding: "0 30px"}}
      >
        <Row align="middle" justify="space-between" style={{height: '100%', maxWidth: '800px', margin: 'auto'}} type="flex">
          <img alt="Quill logo" src={quillLogoSrc} style={{ height: '32px' }} />
          <span onClick={this.handleSaveAndExitClick} style={{ color: 'white', cursor: 'pointer', fontWeight: 600 }}>Save and exit</span>
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
