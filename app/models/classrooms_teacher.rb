class ClassroomsTeacher < ActiveRecord::Base
  include CheckboxCallback

  belongs_to :user
  belongs_to :classroom

  after_create :delete_classroom_minis_cache
  after_commit :trigger_analytics_events_for_classroom_creation, on: :create

  def teacher
    self.user
  end

  private

  def delete_classroom_minis_cache
    $redis.del("user_id:#{self.user_id}_classroom_minis")
  end

  def trigger_analytics_events_for_classroom_creation
    find_or_create_checkbox('Create a Classroom', self.owner)
    ClassroomCreationWorker.perform_async(self.classroom_id)
  end

end
