# frozen_string_literal: true

class Api::V1::AppSettingsController < ApplicationController
  before_action :staff!, only: [:admin_show]

  def index
    render(json: AppSetting.all_enabled_for_user(current_user))
  end

  def show
    name = app_setting_show_params[:name]

    render(json: {
      name => AppSetting.enabled?(name: name, user: current_user)
    })
  end

  def admin_show
    name = app_setting_show_params[:name]
    app_setting = AppSetting.find_by_name!(name)
    user_ids = app_setting.user_ids_allow_list

    users = User.where(id: user_ids)
    emails = users.pluck(:email).compact.sort
    users_without_emails = users.filter {|u| u.email.nil? }.map {|u| u.name }

    render(json: {
      name: name,
      enabled: app_setting.enabled,
      enabled_for_staff: app_setting.enabled_for_staff,
      user_emails_in_allow_list: emails,
      percent_active: app_setting.percent_active,
      users_without_emails: users_without_emails
    })
  end

  private def app_setting_show_params
    params.permit(:name)
  end
end
