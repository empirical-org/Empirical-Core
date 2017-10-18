class Teachers::ProgressReportsController < ApplicationController
  before_action :authorize!, except: :demo
  # before_action :handle_expired_trial, except: :demo
  before_action :set_vary_header, if: -> { request.xhr? || request.format == :json }
  layout 'progress_reports'

  def demo
    begin
      if params[:name] && params[:name] != ""
        @user = User.find_by_email "hello+#{params[:name]}@quill.org"
        if @user.nil?
          raise NoMethodError
        end
      else
        @user = User.find_by_email 'hello+demoteacher@quill.org'
      end
      sign_in @user
      if params[:name] == 'demoaccount'
        redirect_to teachers_progress_reports_concepts_students_path
      elsif params[:name] == 'admin_demo'
        redirect_to profile_path
      else
        redirect_to scorebook_teachers_classrooms_path
      end
    rescue NoMethodError
      Demo::ReportDemoDestroyer.destroy_demo(params[:name])
      Demo::ReportDemoCreator.create_demo(params[:name])
      if params[:name] && params[:name] != ""
        redirect_to "/demo?name=#{params[:name]}"
      else
        redirect_to "/demo"
      end
    end
  end

  def landing_page
    render 'landing_page'
  end

  private

  # def handle_expired_trial
  #   render :trial_expired if (current_user.premium_state == 'locked')
  # end

  def authorize!
    return if current_user.try(:teacher?)
    auth_failed
  end
end
