shared_context "big profile" do
  #include_context "profile"
  let!(:teacher) { FactoryGirl.create(:user, role: 'teacher') }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher)}
  let!(:student) { FactoryGirl.create(:user, role: 'student', classroom: classroom) }

  let!(:number_of_units) { 20 }
  let!(:number_of_activities_per_unit) { 20 }

  let!(:units) { FactoryGirl.create_list(:unit, number_of_units) }

  let!(:classroom_activities) do
    arr = []
    units.each do |u|
      activities = FactoryGirl.create_list(:activity, number_of_activities_per_unit)
      activities.each do |a|
        arr.push FactoryGirl.create(:classroom_activity, classroom: classroom, activity: a, unit: u)
      end
    end
    arr
  end

  let!(:sessions) do
    classroom_activities.map{|ca| ca.session_for(student) }
  end

  let!(:finished) do
    s = units.take(5).map(&:classroom_activities).flatten.map(&:activity_sessions).flatten
    s.each{|s| s.update_attributes(state: 'finished', percentage: 1)}
  end


end