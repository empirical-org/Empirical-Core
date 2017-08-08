class Checkbox < ActiveRecord::Base
  belongs_to :objective
  belongs_to :user

  validates :objective_id, uniqueness: { scope: :user_id, message: "should only be checked once per user" }


  GETTING_STARTED_GUIDE = ['Create a Classroom', "Add Students", "Add School", "Assign Featured Activity Pack", "Assign Entry Diagnostic"]

  def self.find_or_create_checkbox(name, user, flag=nil)
    if (Objective.find_by_name(name) && user)
      self.find_or_create_by(user_id: user.id, objective_id: Objective.find_by_name(name).id)
      CheckboxAnalyticsWorker.perform_async(user.id, name) unless flag
    end
  end

  def self.check_for_earned_checkboxes(teacher_id, from_login=false)
    teacher = User.find teacher_id
    unchecked_checkboxes = teacher.incomplete_objectives
    unchecked_checkboxes.each do |checkbox|
      # if from login, we only want to check the ones that are in the getting started guide
      if !from_login || (from_login && GETTING_STARTED_GUIDE.includes(checkbox))
        Objective.handle_different_objectives(checkbox, teacher_id, 'no analytics')
      end
    end
  end



end
