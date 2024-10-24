# frozen_string_literal: true

module Mailer
  class User < SimpleDelegator
    def send_premium_hub_teacher_account_created_email(admin_name, school_name, is_reminder)
      PremiumHubUserMailer.teacher_account_created_email(self, admin_name, school_name, is_reminder).deliver_now! if email.present?
    end

    def send_premium_hub_admin_account_created_email(admin_name, school_name, is_reminder)
      PremiumHubUserMailer.admin_account_created_email(self, admin_name, school_name, is_reminder).deliver_now! if email.present?
    end

    def send_premium_hub_teacher_link_school_email(admin_name, school)
      PremiumHubUserMailer.teacher_link_school_email(self, admin_name, school).deliver_now! if email.present?
    end

    def send_premium_hub_made_school_admin_email(admin_name, school_name)
      PremiumHubUserMailer.made_school_admin_email(self, admin_name, school_name).deliver_now! if email.present?
    end

    def send_premium_hub_made_school_admin_link_school_email(admin_name, school)
      PremiumHubUserMailer.made_school_admin_link_school_email(self, admin_name, school).deliver_now! if email.present?
    end

    def send_premium_hub_made_school_admin_change_school_email(admin_name, new_school, existing_school)
      PremiumHubUserMailer.made_school_admin_change_school_email(self, admin_name, new_school, existing_school).deliver_now! if email.present?
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

    def send_approved_admin_email(school_name)
      UserMailer.approved_admin_email(self, school_name).deliver_now! if email.present?
    end

    def send_denied_admin_email(school_name)
      UserMailer.denied_admin_email(self, school_name).deliver_now! if email.present?
    end
  end
end
