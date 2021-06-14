class API::V1::AppSettingsController < ApplicationController
  def index
    user = User.find(app_setting_index_params)
    render(json: AppSetting.all_enabled_for_user(user))
  end

  def show
    user = User.find(app_setting_show_params[:user_id])
    name =  app_setting_show_params[:name] 
    render(json: {
      name => AppSetting.enabled?(name: name, user: user)
    })
  end

  private def app_setting_index_params
    params.require(:user_id)
  end

  private def app_setting_show_params
    params.permit(:user_id, :name)
  end
end
