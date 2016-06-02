FactoryGirl.define do
  factory :classroom_activity do
    unit {Unit.first || FactoryGirl.create(:unit)}
    classroom {Classroom.first || FactoryGirl.create(:classroom)}
	  factory :classroom_activity_with_activity do
	  	activity { Activity.first || FactoryGirl.create(:activity) }
	  end
    assigned_student_ids {[]}
  end
end
