# frozen_string_literal: true

module Flagset
  # class Flag
  #   attr_accessor :name, :display_name
  #   def initialize(name:, display_name:)
  #     @name, @display_name = name, display_name
  #   end
  # end
  #FLAGS = %w(production archived alpha beta gamma private)
  extend ActiveSupport::Concern

  self.flagsets = {
    alpha: {
      display_name: 'Alpha',
      flags: {
        'alpha' =>             {  display_name: 'Alpha' },
        'evidence_beta_1' =>   {  display_name: 'Evidence Beta 1' },
        'evidence_beta_2' =>   {  display_name: 'Evidence Beta 2' },
        'beta' =>              {  display_name: 'Beta' },
        'college_board' =>     {  display_name: 'College Board' },
        'production' =>        {  display_name: 'Production' }
      }
    }
  }

  def is_activity_viewable?(activity)
    return false unless activity.is_a?(::Activity)

    user_flagset = Flagset.flagsets.fetch(user.flagset){ return false } #user.flagset cannot be nil

    # if any of left exist in right
    user_flagset[:flags].keys.intersection(activity.flags) > 0
  end
end



# alpha:
# flags:


# **Alpha - User Group**

# - Alpha
# - Evidence Beta 1
# - Evidence Beta 2
# - Beta
# - College Board (Formerly Gamma)
# - Production

# **Evidence Beta 1 - User Group**

# - Evidence Beta 1
# - Evidence Beta 2
# - Production

# **Evidence Beta 2 - User Group**

# - Evidence Beta 2
# - Production

# **Beta - User Group**

# - Beta
# - Production

# **College Board (Formerly Gamma)  - User Group**

# - College Board (Formerly Gamma)
# - Production

# **Production**

# - Production