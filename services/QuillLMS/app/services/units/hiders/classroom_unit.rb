module Units::Hiders::ClassroomUnit

  def self.run(classroom_unit)
    classroom_unit.update(visible: false)
    classroom_unit.activity_sessions.each do |as|
      Units::Hiders::ActivitySession.run(as)
    end
  end

end
