namespace :activity_sessions do 
	desc "identify retries and mark them as such"
	task :retries => :environment do 
		Cleanup.find_and_mark_incompleted_retries
	end
end