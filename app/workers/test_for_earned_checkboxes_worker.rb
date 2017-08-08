class TestForEarnedCheckboxesWorker
  include Sidekiq::Worker

  def perform(teacher_id,from_login=false)
    Checkbox.test_for_earned_checkboxes(teacher_id,from_login)
  end


end
