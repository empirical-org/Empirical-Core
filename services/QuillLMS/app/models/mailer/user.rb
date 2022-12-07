# frozen_string_literal: true

module Mailer
  class User < SimpleDelegator
    def determine_email_and_send(school_id=nil, new_user=nil)
      school = School.find_by(id: school_id)
      linked_school = self.school

      if school && new_user
        send_internal_tool_admin_account_created_email(school_name: school.name)
      elsif school && new_user == false && !linked_school
        send_internal_tool_made_school_admin_link_school_email(school: school)
      elsif school && new_user == false && school == linked_school
        send_internal_tool_made_school_admin_email(school_name: school.name)
      elsif school && new_user == false && school != linked_school
        send_internal_tool_made_school_admin_change_school_email(new_school: school, existing_school: linked_school)
      end
    end

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
