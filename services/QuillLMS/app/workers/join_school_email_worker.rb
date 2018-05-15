class JoinSchoolEmailWorker
  include Sidekiq::Worker

  def perform(user_id, school_id)
    @user = User.find(user_id)
    @school = School.find(school_id)
    @user.send_join_school_email(@school)
  end
end
