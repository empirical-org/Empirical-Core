import { mainApiFetch, requestFailed } from './../../Staff/helpers/evidence/routingHelpers';

interface HandleHasAppSettingArgs {
  appSettingSetter: (value: boolean) => void,
  errorSetter: (value: any) => void,
  key: string,
}

export const handleHasAppSetting = async (args: HandleHasAppSettingArgs) => {
  const response = await mainApiFetch(`app_settings/${args.key}`);

  const { status } = response;

  if(requestFailed(status)) {
    const returnedErrors = [`AppSetting HTTP status: ${status}`]
    args.errorSetter(returnedErrors)
    return { errors: returnedErrors };
  }

  const appSetting = await response.json();

  if (appSetting && appSetting[args.key]) {
    args.appSettingSetter(true)
  } else {
    args.appSettingSetter(false)
  }
  return { errors: [] };
}
