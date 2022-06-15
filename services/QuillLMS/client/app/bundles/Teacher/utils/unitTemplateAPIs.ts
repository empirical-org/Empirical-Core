import { mainFetch, requestFailed } from './../../Staff/helpers/evidence/routingHelpers';
import getAuthToken from '../components/modules/get_auth_token';

export const createUnitTemplate = async (unitTemplate: any) => {
  const response = await mainFetch(`cms/unit_templates`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': getAuthToken()
    },
    body: JSON.stringify({
      unit_template: unitTemplate
    })
  });
  const { status } = response;
  if(requestFailed(status)) {
    return { error: 'Failed to created unit template. Please try again.' };
  }
  return { success: true }
}

export const updateUnitTemplate = async (unitTemplate: any, unitTemplateId: any) => {
  const response = await mainFetch(`cms/unit_templates/${unitTemplateId}`, {
    method: 'PUT',
    headers: {
      'X-CSRF-Token': getAuthToken()
    },
    body: JSON.stringify({
      unit_template: unitTemplate
    }),
  });
  const { status } = response;
  if(requestFailed(status)) {
    return { error: 'Failed to created unit template. Please try again.' };
  }
  return { success: true }
}

export const fetchUnitTemplateCategories = async () => {
  const response = await mainFetch(`cms/unit_template_categories`);
  const json = await response.json();
  const { status } = response;
  if(requestFailed(status)) {
    return { error: 'Failed to fetch unit template categories. Please refresh the page.' };
  } else {
    const { unit_template_categories } = json;
    return { unitTemplateCategories: unit_template_categories }
  }
}
