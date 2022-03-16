import { handleApiError, apiFetch, getModelsUrl } from '../../helpers/evidence/routingHelpers';

export const fetchModels = async ({ queryKey }) => {
  const [key, promptId, state]: [string, number, string?] = queryKey
  const url = getModelsUrl(promptId, state);

  const response = await apiFetch(url);
  let models = await response.json();
  if(models && models.automl_models) {
    models = models.automl_models;
  }
  return { error: handleApiError('Failed to fetch models, please try again.', response), models: models };
}

export const updateModel = async (modelId: number, notes: string) => {
  const response = await apiFetch(`automl_models/${modelId}`, {
    method: 'PUT',
    body: JSON.stringify({notes: notes})
  });

  const updatedModel = await response.json();
  return { error: handleApiError('Failed to update model, please try again.', response), model: updatedModel };
}

export const fetchModel = async ({ queryKey }) => {
  const [key, modelId]: [string, number] = queryKey
  const response = await apiFetch(`automl_models/${modelId}`);
  const model = await response.json();
  return { error: handleApiError('Failed to fetch models, please try again.', response), model: model };
}

export const createModel = async (autoMLId: string, promptId: number, notes: string) => {
  const response = await apiFetch(`automl_models`, {
    method: 'POST',
    body: JSON.stringify({ automl_model_id: autoMLId, prompt_id: promptId, notes })
  });
  const newModel = await response.json();
  return { error: handleApiError('Failed to create model, please try again.', response), model: newModel };
}

export const activateModel = async (modelId: string) => {
  const response = await apiFetch(`automl_models/${modelId}/activate`, {
    method: 'PUT',
    body: JSON.stringify({ model_id: modelId })
  });
  return { error: handleApiError('Failed to create model, please try again.', response)};
}
