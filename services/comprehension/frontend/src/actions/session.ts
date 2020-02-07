import * as request from 'request';

import { ActionTypes } from './actionTypes'

import { FeedbackObject } from '../interfaces/feedback'

export const getFeedback = (activityUID: string, entry: string, promptID: string, promptText: string, attempt: number, previousFeedback: FeedbackObject[], callback?: Function) => {
  return (dispatch: Function) => {
    const feedbackURL = 'https://us-central1-comprehension-247816.cloudfunctions.net/comprehension-endpoint-go'
    const promptRegex = new RegExp(`^${promptText}`)
    const entryWithoutStem = entry.replace(promptRegex, "").trim()

    const requestObject = {
      url: feedbackURL,
      body: {
        prompt_id: promptID,
        entry: entryWithoutStem,
        previous_responses: previousFeedback,
        attempt
      },
      json: true,
    }

    const potentialHighlights = [
      [{type: 'passage', id: 'what', text: "When softball player Ariana Chretien heard the news, she grew worried. The cuts meant that Chretien would have to choose between two of her passions--softball and aviation. Although Chretien had received multiple softball scholarship offers, Eastern Michigan was the only school that also offered an aviation major. She explained, 'My major is aviation, and not a lot of schools have that. So, either I find a school with aviation but no scholarships or scholarships but no major.'"}],
      [{ type: "passage", id: "whatever", text: "The judge emphasized that the cuts to the women’s teams made the situation even worse. He explained that the cuts showed that the school was not making enough effort to give women equal access to sports."}],
      [{ type: "passage", id: "whatever", text: "Title IX requires schools to give men and women equal chances to play sports."}]
    ]

    request.post(requestObject, (e, r, body) => {
      const feedbackObj: FeedbackObject = {
        feedback: body.feedback,
        feedback_type: body.feedback_type,
        optimal: body.optimal,
        response_id: body.response_id,
        highlight: body.highlight.concat(potentialHighlights[Math.floor(Math.random() * potentialHighlights.length)]),
      }
      dispatch({ type: ActionTypes.RECORD_FEEDBACK, promptID, feedbackObj });
      if (callback) {
        callback()
      }
    })
  }
}
