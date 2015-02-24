FactoryGirl.define do

  factory :classroom_activity do
	  	

	  factory :classroom_activity_with_activity do 
	  	activity { Activity.first || FactoryGirl.create(:activity) }
	  end

  end

end
