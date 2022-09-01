# frozen_string_literal: true

# This concern is only intended to be included in the User model
module UserFlagset
  extend ActiveSupport::Concern

  included do
    FLAGSETS = {

      production: {
        display_name: 'production',
        flags: {
          Flags::PRODUCTION =>        { display_name: 'Production' }
        }
      },

      alpha: {
        display_name: 'Alpha',
        flags: {
          Flags::ALPHA =>             { display_name: 'Alpha' },
          Flags::EVIDENCE_BETA1 =>    { display_name: 'Evidence Beta 1' },
          Flags::EVIDENCE_BETA2 =>    { display_name: 'Evidence Beta 2' },
          Flags::BETA =>              { display_name: 'Beta' },
          Flags::COLLEGE_BOARD =>     { display_name: 'College Board' },
          Flags::PRODUCTION =>        { display_name: 'Production' }
        }
      },

      evidence_beta1: {
        display_name: 'Evidence Beta 1',
        flags: {
          Flags::EVIDENCE_BETA1 =>    { display_name: 'Evidence Beta 1' },
          Flags::EVIDENCE_BETA2 =>    { display_name: 'Evidence Beta 2' },
          Flags::PRODUCTION =>        { display_name: 'Production' }
        }
      },

      evidence_beta2: {
        display_name: 'Evidence Beta 2',
        flags: {
          Flags::EVIDENCE_BETA2 =>    { display_name: 'Evidence Beta 2' },
          Flags::PRODUCTION =>        { display_name: 'Production' }
        }
      },

      beta: {
        display_name: 'Beta',
        flags: {
          Flags::BETA =>              { display_name: 'Beta' },
          Flags::PRODUCTION =>        { display_name: 'Production' }
        }
      },

      college_board: {
        display_name: 'College Board',
        flags: {
          Flags::COLLEGE_BOARD  =>    { display_name: 'College Board' },
          Flags::PRODUCTION =>        { display_name: 'Production' }
        }
      }
    }

    validates :flagset, inclusion: { in: FLAGSETS.keys.map(&:to_s) }
  end

  def self.decorated
    FLAGSETS.map{|key, value| {value: key.to_s, label: value[:display_name]}}
  end

  def self.flags_for_flagset(flagset)
    return nil unless flagset
    FLAGSETS[flagset.to_sym][:flags].keys.map{|k| "'#{k}'"}.join(',')
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
