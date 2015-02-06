namespace :activity_sessions do 
	desc "identify retries and mark them as such"
	task :retries => :environment do 

		ClassroomActivity.find_each do |ca|
			


		end




	end

end