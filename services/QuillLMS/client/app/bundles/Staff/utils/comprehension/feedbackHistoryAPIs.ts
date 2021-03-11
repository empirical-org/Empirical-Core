import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const editFeedbackHistory = async (feedbackHistoryId, data) => {
  const response = await apiFetch(`feedback_histories/${feedbackHistoryId}`, {
    method: 'PUT',
    body: JSON.stringify({
      feedback_history: data
    })
  });
  return { error: handleApiError('Failed to edit feedback history, please try again.', response) };
}
