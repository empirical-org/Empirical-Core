namespace :admin_caches do
  desc 'reset caches for district admin reports'
  task :reset => :environment do
    SchoolsAdmins.all.each do |sa|
      if sa.user
        FindAdminUsersWorker.perform_async(sa.user_id)
        FindDistrictConceptReportsWorker.perform_async(sa.user_id)
        FindDistrictStandardsReportsWorker.perform_async(sa.user_id)
        FindDistrictActivityScoresWorker.perform_async(sa.user_id)
      end
    end
  end
end
