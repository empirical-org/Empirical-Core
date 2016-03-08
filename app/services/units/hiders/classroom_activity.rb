module Units::Hiders::ClassroomActivity

  def self.run(classroom_activity)
    classroom_activity.update(visible: false)
    classroom_activity.activity_sessions.each do |as|
      Units::Hiders::ActivitySession.run(as)
    end
  end

end