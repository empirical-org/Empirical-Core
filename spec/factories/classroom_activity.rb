FactoryGirl.define do
  factory :classroom_activity do
    classroom {Classroom.first || FactoryGirl.create(:classroom)}
	  factory :classroom_activity_with_activity do
	  	activity { Activity.first || FactoryGirl.create(:activity) }
	  end
  end
end
