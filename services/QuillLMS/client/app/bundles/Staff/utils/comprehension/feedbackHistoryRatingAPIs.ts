import { handleApiError, mainFetch } from '../../helpers/comprehension';

export const createOrUpdateFeedbackHistoryRating = async (data) => {
  const response = await mainFetch('feedback_history_rating', {
    method: 'PUT',
    body: JSON.stringify({
      feedback_history_rating: data
    })
  });
  return { error: handleApiError('Failed to edit feedback history, please try again.', response) };
}
