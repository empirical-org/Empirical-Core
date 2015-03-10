FactoryGirl.define do

	factory :topic_category do |f|
		sequence(:name) {|i| 'topic category #{i}'}
	end

end