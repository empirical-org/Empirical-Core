import * as React from "react";
import { Layout, Row } from "antd";
import { Link } from "react-router-dom";
import getParameterByName from '../helpers/getParameterByName';
import '../styles/Header.scss'

import { PlayProofreaderContainer } from "./proofreaderActivities/container"
import { ProofreaderActivityState } from '../reducers/proofreaderActivitiesReducer'

import {
  updateConceptResultsOnFirebase,
  updateSessionOnFirebase,
  setSessionReducerToSavedSession,
  removeSession
} from "../actions/session";

export const Header: React.StatelessComponent<{}> = () => {

  const handleClick = () => {
    let firebaseSessionID = getParameterByName('student', window.location.href);
    console.log(firebaseSessionID);

    let passageToSave = null;
    let passage = document.getElementsByClassName('passage')[0].innerHTML;
    console.log(passage);
    passage = passage.replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
    const necessaryEdits = passage.match(/{\+[^-]+-[^|]+\|[^}]*}/g)
    const necessaryEditRegex = /\+[^-]+-[^|]+\|[^}]*/
    const correctEditRegex = /\+([^-]+)-/m
    const originalTextRegex = /\-([^|]+)\|/m
    const conceptUIDRegex = /\|([^}]+)/m
    const paragraphs = passage.replace('</p><p>', '<br/>').replace(/<p>|<\/p>/g, '').split('<br/>')
    let necessaryEditCounter = 0
    let paragraphIndex = 0
    const passageArray = paragraphs.map((paragraph: string) => {
      if (paragraph.length === 0) {
        return null
      }
      let i = 0
      const paragraphArray = paragraph.split(/{|}/).map((text) => {
        let wordObj, wordArray
        if (necessaryEditRegex.test(text)) {
          wordObj = {
            originalText: text.match(originalTextRegex) ? text.match(originalTextRegex)[1] : '',
            currentText: text.match(originalTextRegex) ? text.match(originalTextRegex)[1] : '',
            necessaryEditIndex: necessaryEditCounter,
            conceptUID: text.match(conceptUIDRegex) ? text.match(conceptUIDRegex)[1] : '',
            correctText: text.match(correctEditRegex) ? text.match(correctEditRegex)[1] : '',
            underlined: true,
            wordIndex: i,
            paragraphIndex
          }
          wordArray = [wordObj]
          necessaryEditCounter++
          i++
        } else {
          wordArray = text.split(/\s+/).map(word => {
            if (word.length === 0) {
              return null
            }
            wordObj = {
              originalText: word,
              currentText: word,
              correctText: word,
              underlined: false,
              wordIndex: i,
              paragraphIndex
            }
            i++
            return wordObj
          })
        }
        return wordArray.filter(Boolean)
      })
      paragraphIndex++
      return _.flatten(paragraphArray)
    })
    console.log(passageArray);

    if (firebaseSessionID) {
      var pa = new ProofreaderActivityState();
      const { passage } = pa.currentActivity;
      //updateSessionOnFirebase(firebaseSessionID, passageArray);
      updateSessionOnFirebase(firebaseSessionID, passage);
      console.log("SAVED TO FIREBASE");
    }

    //window.location.replace(process.env.EMPIRICAL_BASE_URL);
  }

    return (
        <Layout.Header style={{
          height: '60px',
          width: "100%",
          backgroundColor: "#00c2a2",
          padding: "0 30px"}}>
          <Row type="flex" align="middle" justify="space-between" style={{height: '100%', maxWidth: '896px', margin: 'auto'}}>
            <img style={{ height: '25px' }} src="https://d2t498vi8pate3.cloudfront.net/assets/home-header-logo-8d37f4195730352f0055d39f7e88df602e2d67bdab1000ac5886c5a492400c9d.png" />
            <a style={{ color: 'white' }} id="save_and_exit" onClick={handleClick}>Save & Exit</a>
          </Row>
        </Layout.Header>
    );
};
