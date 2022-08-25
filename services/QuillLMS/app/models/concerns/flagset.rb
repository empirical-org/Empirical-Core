# frozen_string_literal: true

# This concern is only intended to be included in the User model
module Flagset
  #FLAGS = %w(production archived alpha beta gamma private)
  extend ActiveSupport::Concern


  included do
    FLAGSETS = {

      production: {
        display_name: 'production',
        flags: {
          'production' =>        { display_name: 'Production' }
        }
      },

      alpha: {
        display_name: 'Alpha',
        flags: {
          'alpha' =>             { display_name: 'Alpha' },
          'evidence_beta1' =>   { display_name: 'Evidence Beta 1' },
          'evidence_beta2' =>   { display_name: 'Evidence Beta 2' },
          'beta' =>              { display_name: 'Beta' },
          'college_board' =>     { display_name: 'College Board' },
          'production' =>        { display_name: 'Production' }
        }
      },

      evidence_beta1: {
        display_name: 'Evidence Beta 1',
        flags: {
          'evidence_beta1' =>   { display_name: 'Evidence Beta 1' },
          'evidence_beta2' =>   { display_name: 'Evidence Beta 2' },
          'production' =>        { display_name: 'Production' }
        }
      },

      evidence_beta2: {
        display_name: 'Evidence Beta 2',
        flags: {
          'evidence_beta1' =>   { display_name: 'Evidence Beta 1' },
          'production' =>        { display_name: 'Production' }
        }
      },

      beta: {
        display_name: 'Beta',
        flags: {
          'beta' =>              { display_name: 'Beta' },
          'production' =>        { display_name: 'Production' }
        }
      },

      college_board: {
        display_name: 'College Board',
        flags: {
          'college_board' =>     { display_name: 'College Board' },
          'production' =>        { display_name: 'Production' }
        }
      }
    }

    validates :flagset, inclusion: { in: FLAGSETS.keys.map(&:to_s) }
  end

  def activity_viewable?(activity)
    return false unless activity.is_a?(::Activity)

    user_flagset = FLAGSETS.fetch(flagset.to_sym){ return false }

    # NOTE: We coerce activity.flags to strings here, even though they are
    # persisted as strings, because Activity.rb coerces them to symbols at the moment.
    intersections = user_flagset[:flags].keys.intersection(activity.flags.map(&:to_s))
    intersections.count > 0
  end
end
