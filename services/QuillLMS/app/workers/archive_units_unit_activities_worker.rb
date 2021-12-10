# frozen_string_literal: true

class ArchiveUnitsUnitActivitiesWorker
  include Sidekiq::Worker
  sidekiq_options queue: 'critical'

  def perform(id)
    @unit = Unit.unscoped.find id
    @unit.unit_activities.each do |unit_act|
      unit_act.update(visible: false)
    end
  end

end
