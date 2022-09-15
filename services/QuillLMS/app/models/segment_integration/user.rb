# frozen_string_literal: true

module SegmentIntegration
  class User < SimpleDelegator
    def identify_params
      {
        user_id: id,
        traits: {
          **common_params,
          auditor: auditor?,
          first_name: first_name,
          last_name: last_name,
          email: email,
          flags: flags&.join(", "),
          flagset: flagset
        }.reject {|_,v| v.nil? },
        integrations: integration_rules
      }
    end

    def common_params
      {
        district: school&.district&.name,
        school_id: school&.id,
        school_name: school&.name,
        premium_state: premium_state,
        premium_type: subscription&.account_type,
        is_admin: admin?
      }.reject {|_,v| v.nil? }
    end

    def premium_params
      {
        email: email,
        premium_state: premium_state,
        premium_type: subscription&.account_type,
      }.reject {|_,v| v.nil? }
    end

    def integration_rules
      { all: true, Intercom: (teacher?) }
    end
  end
end
