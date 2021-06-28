import { mainApiFetch, handleApiError } from './../../Staff/helpers/comprehension';

export const fetchAppSetting = async (key: string, appSettingName: string) => {
  const response = await mainApiFetch(`app_settings/${appSettingName}`);

  const appSetting = await response.json();
  return {
    appSetting,
    error: handleApiError('Failed to fetch activities, please refresh the page.', appSetting)
  };
}