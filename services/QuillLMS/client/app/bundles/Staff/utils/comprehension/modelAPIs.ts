import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const fetchModels = async (key: string, promptId?: any) => {
  let url = 'automl_models';
  if(promptId) {
    url = url + `?prompt_id=${promptId}`;
  }
  const response = await apiFetch(url);
  const models = await response.json();
  return { error: handleApiError('Failed to fetch models, please try again.', response), models: models };
}

export const createModel = async (autoMLId: string, promptId: number) => {
  const response = await apiFetch(`automl_models`, {
    method: 'POST',
    body: JSON.stringify({ automl_model_id: autoMLId, prompt_id: promptId })
  });
  const newModel = await response.json();
  return { error: handleApiError('Failed to create model, please try again.', response), model: newModel };
}
