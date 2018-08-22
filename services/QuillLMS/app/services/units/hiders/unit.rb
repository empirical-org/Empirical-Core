module Units::Hiders::Unit

  def self.run(id)
    unit = Unit.find(id)
    unit.update(visible: false)
    unit.classroom_units.each do |cu|
      Units::Hiders::ClassroomUnit.run(cu)
    end
    unit.unit_activities.each do |ua|
      Units::Hiders::UnitActivity.run(ua)
    end
  end


end
