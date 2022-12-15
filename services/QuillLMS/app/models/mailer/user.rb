# frozen_string_literal: true

module Mailer
  class User < SimpleDelegator

    # rubocop:disable Metrics/CyclomaticComplexity
    def determine_email_and_send(params)
      school_id = params[:school_id]
      district_id = params[:district_id]
      new_user = params[:new_user]

      if school_id
        school = School.find_by(id: school_id)
        linked_school = self.school
        if school && new_user
          send_internal_tool_admin_account_created_email(school.name)
        elsif school && !new_user && !linked_school
          send_internal_tool_made_school_admin_link_school_email(school)
        elsif school && !new_user && school == linked_school
          send_internal_tool_made_school_admin_email(school.name)
        elsif school && !new_user && school != linked_school
          send_internal_tool_made_school_admin_change_school_email(school, linked_school)
        end
      elsif district_id
        district_name = District.find_by(id: district_id)&.name
        if new_user
          send_internal_tool_district_admin_account_created_email(district_name)
        else
          send_internal_tool_made_district_admin_email(district_name)
        end
      end
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    def send_admin_dashboard_teacher_account_created_email(admin_name, school_name, is_reminder)
      AdminDashboardUserMailer.teacher_account_created_email(self, admin_name, school_name, is_reminder).deliver_now! if email.present?
    end

    def send_admin_dashboard_admin_account_created_email(admin_name, school_name, is_reminder)
      AdminDashboardUserMailer.admin_account_created_email(self, admin_name, school_name, is_reminder).deliver_now! if email.present?
    end

    def send_admin_dashboard_teacher_link_school_email(admin_name, school)
      AdminDashboardUserMailer.teacher_link_school_email(self, admin_name, school).deliver_now! if email.present?
    end

    def send_admin_dashboard_made_school_admin_email(admin_name, school_name)
      AdminDashboardUserMailer.made_school_admin_email(self, admin_name, school_name).deliver_now! if email.present?
    end

    def send_admin_dashboard_made_school_admin_link_school_email(admin_name, school)
      AdminDashboardUserMailer.made_school_admin_link_school_email(self, admin_name, school).deliver_now! if email.present?
    end

    def send_admin_dashboard_made_school_admin_change_school_email(admin_name, new_school, existing_school)
      AdminDashboardUserMailer.made_school_admin_change_school_email(self, admin_name, new_school, existing_school).deliver_now! if email.present?
    end

    def send_internal_tool_admin_account_created_email(school_name)
      InternalToolUserMailer.admin_account_created_email(self, school_name).deliver_now! if email.present?
    end

    def send_internal_tool_made_school_admin_email(school_name)
      InternalToolUserMailer.made_school_admin_email(self, school_name).deliver_now! if email.present?
    end

    def send_internal_tool_made_school_admin_link_school_email(school)
      InternalToolUserMailer.made_school_admin_link_school_email(self, school).deliver_now! if email.present?
    end

    def send_internal_tool_made_school_admin_change_school_email(new_school, existing_school)
      InternalToolUserMailer.made_school_admin_change_school_email(self, new_school, existing_school).deliver_now! if email.present?
    end

    def send_internal_tool_district_admin_account_created_email(district_name)
      InternalToolUserMailer.district_admin_account_created_email(self, district_name).deliver_now! if email.present?
    end

    def send_internal_tool_made_district_admin_email(district_name)
      InternalToolUserMailer.made_district_admin_email(self, district_name).deliver_now! if email.present?
    end
  end
end
