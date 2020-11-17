import * as React from "react";
import { Layout, Row } from "antd";
import * as Redux from "redux";
import { connect } from "react-redux";
import '../styles/headerStyling.scss'

import getParameterByName from '../helpers/getParameterByName';

const quillLogoSrc = `${process.env.CDN_URL}/images/logos/quill-logo-white.svg`

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
    window.location.href = `${process.env.DEFAULT_URL}`
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
      <Layout.Header className="header">
        <Row align="middle" justify="space-between" style={{height: '100%', maxWidth: '800px', margin: 'auto'}} type="flex">
          <a className="focus-on-dark" href={process.env.DEFAULT_URL}><img alt="Quill logo" src={quillLogoSrc} /></a>
          <button className="focus-on-dark" onClick={this.handleSaveAndExitClick} type="button">Save and exit</button>
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
