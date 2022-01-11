import { handleApiError, mainFetch } from '../../helpers/evidence/routingHelpers';

export const createOrUpdateFeedbackHistoryRating = async (data) => {
  const response = await mainFetch('feedback_history_rating', {
    method: 'PUT',
    body: JSON.stringify({
      feedback_history_rating: data
    })
  });
  return { error: handleApiError('Failed to edit feedback history, please try again.', response) };
}

export const massCreateOrUpdateFeedbackHistoryRating = async (data) => {
  const response = await mainFetch('feedback_history_rating/mass_mark', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return { error: handleApiError(response.error_messages, response) };
}
