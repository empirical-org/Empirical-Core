namespace :referrals do
  desc 'activate referrals'
  task activate: :environment do
    ActiveRecord::Base.connection.execute("
      SELECT referrals_users.id FROM referrals_users
      JOIN classrooms_teachers ON referrals_users.referred_user_id = classrooms_teachers.user_id
      JOIN classroom_activities ON classrooms_teachers.classroom_id = classroom_activities.classroom_id
      JOIN activity_sessions ON activity_sessions.classroom_activity_id = classroom_activities.id
      WHERE referrals_users.activated = FALSE
    ").to_a.map(&:values).flatten.each do |id|
    # We are not doing this in SQL directly because we want callbacks to run.
      ReferralsUser.find(id).update(activated: true)
    end
  end
end
