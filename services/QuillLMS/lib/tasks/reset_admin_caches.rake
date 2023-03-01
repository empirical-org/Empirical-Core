# frozen_string_literal: true

namespace :admin_caches do
  desc 'reset caches for district admin reports'
  task :reset => :environment do
    SchoolsAdmins.all.select { |sa| sa.user && sa.user.last_sign_in && sa.user.last_sign_in > 1.month.ago }.pluck(:user_id).uniq.each do |user_id|
      if User.find_by_id(user_id)
        FindAdminUsersWorker.perform_async(user_id)
        FindDistrictConceptReportsWorker.perform_async(user_id)
        FindDistrictStandardsReportsWorker.perform_async(user_id)
        FindDistrictActivityScoresWorker.perform_async(user_id)
      end
    end
  end
end
