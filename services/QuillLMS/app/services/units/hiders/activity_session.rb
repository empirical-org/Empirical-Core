# frozen_string_literal: true

module Units::Hiders::ActivitySession

  def self.run(activity_session)
    activity_session.update(visible: false)
  end
end