namespace :activity_sessions do 
	desc "identify retries and mark them as such"
	task :retries => :environment do 

		ClassroomActivity.find_each do |ca|
			as = ca.activity_sessions
			x = as.group_by{|ele| ele.user_id}


			x.each do |key, value|
			
				user1_activity_sessions = value
					
				if user1_activity_sessions.map(&:created_at).length == user1_activity_sessions.map(&:created_at).compact.length
					first = user1_activity_sessions.min{|a, b| a.created_at <=> b.created_at}
					
					
					rest = user1_activity_sessions.reject{|c| c.id == first.id}

					first.update_attribute :is_retry, false
					
					rest.each do |retry_n|
						retry_n.update_attribute :is_retry, true
					end
				end

			end


		end




	end

end