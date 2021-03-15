import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const createModel = async (autoMLId: string) => {
  const response = await apiFetch(`automl_models`, {
    method: 'POST',
    body: JSON.stringify({ automl_model_id: autoMLId })
  });
  const newModel = await response.json();
  return { error: handleApiError('Failed to create rule, please try again.', response), model: newModel };
}
