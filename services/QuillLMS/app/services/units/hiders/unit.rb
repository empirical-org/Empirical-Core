module Units::Hiders::Unit

  def self.run(id)
    unit = Unit.find(id)
    unit.update(visible: false)
    unit.classroom_activities.each do |ca|
      Units::Hiders::ClassroomActivity.run(ca)
    end
  end


end