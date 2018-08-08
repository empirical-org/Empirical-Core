module Units::Hiders::UnitActivity

  def self.run(unit_activity)
    unit_activity.update(visible: false)
  end
end
