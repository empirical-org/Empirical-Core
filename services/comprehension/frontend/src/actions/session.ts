import * as request from 'request';

import { ActionTypes } from './actionTypes'

import { FeedbackObject } from '../interfaces/feedback'

// TODO remove dummy method.
const randomFeedbackString = () => {
  const feedbackStrings = [
    "Good start! You stated that compulsory voting will ensure that more voices are heard. Now take it one step further—according to the passage, why is it important that more voices are heard?",
    "Good start! You said something that indicated that you read the passage. Now take it one step further: how does the passage help you answer this question?",
    "Keep going! You are clearly capable of figuring out an optimal answer to this question. Please type more random words into this box.",
    "Keep going! Emilia believes in you. You're doing a great job so far and I bet if you try a little harder you can get an optimal answer!",
    "Nice work! This is a random feedback generator but I bet you're doing great. Keep going so you can keep seeing the cute little animation do its thing."
  ]
  return feedbackStrings[Math.floor(Math.random()*feedbackStrings.length)]
}

export const getFeedback = (activityUID: string, entry: string, promptID: string) => {
  return (dispatch: Function) => {
    const feedbackURL = 'https://us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go'
    // TODO remove dummy endpoint and mock responses
    // const feedbackURL = `https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/${activityUID}/responses.json`
    // TODO remove this hack
    const entryWithoutStem = entry.replace(/^Eastern Michigan University cut women's tennis and softball because/, "").trim()
    const requestObject = {
      url: feedbackURL,
      body: {'prompt_id': promptID, 'entry': entryWithoutStem},
      json: true,
    }

    request.post(requestObject, (e, r, body) => {
      const feedbackObj: FeedbackObject = {
        feedback: body.feedback,
        feedback_type: body.feedback_type,
        optimal: body.optimal,
        response_id: body.response_id,
        entry,
      }
      // const matchedResponse = responses.find((r: any) => r.text === entry)
      // if (matchedResponse) {
      //   feedbackObj = {
      //     feedback: "That's a really strong sentence! You used evidence from the text to identify why governments should make voting compulsory.",
      //     feedback_type: "semantic",
      //     optimal: true,
      //     response_id: matchedResponse.response_id,
      //     entry
      //   }
      // }
      dispatch({ type: ActionTypes.RECORD_FEEDBACK, promptID, feedbackObj });
    })
  }
}
