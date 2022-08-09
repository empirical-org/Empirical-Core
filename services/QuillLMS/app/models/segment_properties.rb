# frozen_string_literal: true

module SegmentProperties
  class User < SimpleDelegator
    def identify_params
      {
        user_id: id,
        traits: {
          **common_params,
          auditor: auditor?,
          first_name: first_name,
          last_name: last_name,
          email: email
        }.reject {|_,v| v.nil? },
        integrations: integration_rules
      }
    end

    def common_params
      {
        district: school&.district&.name,
        school_name: school&.name,
        premium_state: premium_state,
        premium_type: subscription&.account_type,
        is_admin: admin?
      }.reject {|_,v| v.nil? }
    end

    def integration_rules
      return { all: true, Intercom: false } if self.nil?

      { all: true, Intercom: (teacher?) }
    end
  end
end
