# frozen_string_literal: true

namespace :activities do
  desc 'Set follow_up_activity_id values on new Diagnostics'
  task :set_new_follow_up_activity_ids => :environment do
    pre_post_id_pairs = [
      [2537, 2538], # Starter
      [2539, 2540], # Intermediate
      [2541, 2542], # Advanced
      [2550, 2551], # ELL Starter
      [2555, 2557], # ELL Intermediate
      [2563, 2564] # ELL Advanced
    ]
    pre_post_id_pairs.each do |id, follow_up_activity_id|
      Activity.where(id:)
        .update(follow_up_activity_id:)
    end
  end
end
