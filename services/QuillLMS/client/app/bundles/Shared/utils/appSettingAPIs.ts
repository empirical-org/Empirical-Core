import { mainApiFetch, requestFailed, handleRequestErrors } from './../../Staff/helpers/comprehension';

export const handleHasAppSetting = async (hasAppSetting, setHasAppSetting, key: string) => {
  const response = await mainApiFetch(`app_settings/${key}`);

  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }

  const appSetting = await response.json();

  if (appSetting && appSetting[key]) {
    setHasAppSetting(true)
  } else {
    setHasAppSetting(false)
  }
  return { errors: [] };
}