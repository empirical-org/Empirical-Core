class ArchiveUnitsUnitActivitiesWorker
  include Sidekiq::Worker

  def perform(id)
    @unit = Unit.unscoped.find id
    @unit.unit_activities.each do |unit_act|
      unit_act.update(visible: false)
    end
  end

end
