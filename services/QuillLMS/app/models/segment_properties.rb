# frozen_string_literal: true

module SegmentProperties
  class User < SimpleDelegator
    def identify_params
      {
        user_id: id,
        traits: {
          premium_state: premium_state,
          premium_type: subscription&.account_type,
          auditor: auditor?,
          is_admin: admin?,
          first_name: first_name,
          last_name: last_name,
          email: email,
          school_name: school&.name,
          school_id: school&.id,
          district: school&.district&.name
        }.reject {|_,v| v.nil? },
        integrations: integration_rules
      }
    end

    def integration_rules
      return { all: true, Intercom: false } if self.nil?

      {
       all: true,
       Intercom: (teacher?)
      }
    end
  end
end
