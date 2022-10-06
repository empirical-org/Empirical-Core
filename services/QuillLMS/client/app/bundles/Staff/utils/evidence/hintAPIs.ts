import { HintInterface } from '../../interfaces/evidenceInterfaces';
import { handleApiError, apiFetch, handleRequestErrors, requestFailed } from '../../helpers/evidence/routingHelpers';

export const fetchHints = async () => {
  const response = await apiFetch(`hints`);
  let hints = await response.json();
  if(hints && hints.hints) {
    hints = hints.hints;
  }
  return {
    error: handleApiError('Failed to fetch hints, please refresh the page.', response),
    hints: hints
  };
}

export const fetchHint = async ({ queryKey, }) => {
  const [key, hintId]: [string, string] = queryKey

  const response = await apiFetch(`hints/${hintId}`);
  const hint = await response.json();
  return {
    error: handleApiError('Failed to fetch hint, please refresh the page.', response),
    hint
  };
}

export const deleteHint = async (hintId: string) => {
  const response = await apiFetch(`hints/${hintId}`, {
    method: 'DELETE'
  });
  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}

export const createHint = async (hint: HintInterface) => {
  const response = await apiFetch(`hints`, {
    method: 'POST',
    body: JSON.stringify({ hint })
  });
  const { status } = response;
  const newHintOrErrors = await response.json();

  if(requestFailed(status)) {
    const returnedErrors = await handleRequestErrors(newHintOrErrors);
    return { errors: returnedErrors, rule: null };
  }
  return { errors: [], hint: newHintOrErrors };
}

export const updateHint = async (hintId: number, hint: HintInterface) => {
  const response = await apiFetch(`hints/${hintId}`, {
    method: 'PUT',
    body: JSON.stringify({ hint })
  });

  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}
