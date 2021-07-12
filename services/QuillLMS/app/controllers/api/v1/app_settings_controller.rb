class Api::V1::AppSettingsController < ApplicationController
  def index
    render(json: AppSetting.all_enabled_for_user(current_user))
  end

  def show
    name = app_setting_show_params[:name] 

    render(json: {
      name => AppSetting.enabled?(name: name, user: current_user)
    })
  end

  private def app_setting_show_params
    params.permit(:name)
  end
end
