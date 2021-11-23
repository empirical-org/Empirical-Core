# frozen_string_literal: true

module NewRelicAttributable
  extend ActiveSupport::Concern

  included do
    before_action :set_new_relic_attributes
  end

  private def set_new_relic_attributes
    ::NewRelic::Agent.add_custom_attributes({
      user_id: current_user.try(:id)
    })
  end
end
