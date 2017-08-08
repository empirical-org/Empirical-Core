class TestForEarnedCheckboxesWorker
  include Sidekiq::Worker

  def perform(teacher_id)
    teacher = User.find teacher_id
    unchecked_checkboxes = teacher.incomplete_objectives
    unchecked_checkboxes.each do |checkbox|
      Objective.handle_different_objectives(checkbox, teacher_id, 'no analytics')
    end
  end


end
