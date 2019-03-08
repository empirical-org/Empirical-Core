namespace :admin_caches do
  desc 'reset caches for district admin reports'
  task :reset => :environment do
    SchoolsAdmins.all.select { |sa| sa.user && sa.user.last_sign_in && sa.user.last_sign_in > 1.month.ago }.each do |sa|
      if sa.user && sa.user_id
        FindAdminUsersWorker.perform_async(sa.user_id)
        FindDistrictConceptReportsWorker.perform_async(sa.user_id)
        FindDistrictStandardsReportsWorker.perform_async(sa.user_id)
        FindDistrictActivityScoresWorker.perform_async(sa.user_id)
      end
    end
  end
end
