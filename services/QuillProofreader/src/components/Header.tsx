import * as React from "react";
import {connect} from "react-redux";
import { Layout, Row } from "antd";
import { Link } from "react-router-dom";
import { WordObject } from '../interfaces/proofreaderActivities';
import { ProofreaderActivityState } from '../reducers/proofreaderActivitiesReducer';
import { PlayProofreaderContainerProps, PlayProofreaderContainerState } from '../proofreaderActivities/container';
import getParameterByName from '../helpers/getParameterByName';
import {
  updateConceptResultsOnFirebase,
  updateSessionOnFirebase,
  setSessionReducerToSavedSession,
  removeSession
} from "../actions/session";
import '../styles/Header.scss'

export class Header extends React.Component<PlayProofreaderContainerProps, PlayProofreaderContainerState> {
    constructor(props: any) {
      super(props);

      this.state = {
        edits: 0,
        reviewing: false,
        showEarlySubmitModal: false,
        showReviewModal: false,
        showResetModal: false,
        resetting: false,
        firebaseSessionID: getParameterByName('student', window.location.href)
      }
    }

    componentWillMount() {
      const { firebaseSessionID, } = this.state
    }

    componentWillReceiveProps(nextProps: PlayProofreaderContainerProps) {
      if (
        (nextProps.proofreaderActivities.currentActivity && !this.state.passage)
        || (!_.isEqual(nextProps.proofreaderActivities.currentActivity, this.props.proofreaderActivities.currentActivity))
      ) {
        const { passage } = nextProps.proofreaderActivities.currentActivity
        const initialPassageData = this.formatInitialPassage(passage)
        const formattedPassage = initialPassageData.passage
        let currentPassage = formattedPassage
        if (
          nextProps.session.passageFromFirebase
          && typeof nextProps.session.passageFromFirebase !== 'string'
        ) {
          currentPassage = nextProps.session.passageFromFirebase
        }
        this.setState({ passage: currentPassage, originalPassage: _.cloneDeep(formattedPassage), necessaryEdits: initialPassageData.necessaryEdits, edits: this.editCount(currentPassage) })
      }
    }

    saveEditedSessionToFirebase() {
      const { firebaseSessionID, } = this.state
      const { passage } = this.state
      updateSessionOnFirebase(firebaseSessionID, passage)
    }

    public render(): JSX.Element {
      return (
          <Layout.Header style={{
            height: '60px',
            width: "100%",
            backgroundColor: "#00c2a2",
            padding: "0 30px"}}>
            <Row type="flex" align="middle" justify="space-between" style={{height: '100%', maxWidth: '896px', margin: 'auto'}}>
              <img style={{ height: '25px' }} src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png" />
              <a style={{ color: 'white' }} onClick={this.saveEditedSessionToFirebase()}>Save & Exit</a>
            </Row>
          </Layout.Header>
      );
    }
};

const mapStateToProps = (state: any) => {
    return {
      proofreaderActivities: state.proofreaderActivities,
      session: state.session,
      concepts: state.concepts,
      passage: state.passage
    };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);