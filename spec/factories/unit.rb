FactoryGirl.define do

	factory :unit do |f|
		sequence(:name) {|i| "Unit #{i}"}

	end
	
end