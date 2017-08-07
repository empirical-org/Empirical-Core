class Objective < ActiveRecord::Base
  has_many :checkboxes
  has_many :users, through: :checkboxes

  def self.handle_different_objectives(objective_name, user_id, flag=nil)
    # TODO: finish this!
    user = User.find(user_id)
    case objective_name
    when "Create a Classroom"
      find_or_create_checkbox(objective_name, user, flag) if (user.has_classrooms?)
    when "Add Students"
      find_or_create_checkbox(objective_name, user, flag) if (user.has_students?)
    when "Add School"
      find_or_create_checkbox(objective_name, user, flag) if (user.schools.any?)
    when 'Complete 10 Activities'
      find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 10)
    when 'Complete 100 Activities'
      find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 100)
    when 'Complete 250 Activities'
      find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 250)
    when 'Complete 500 Activities'
      find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 500)
    when 'Complete 1000 Activities'
      find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 1000)
    when 'Assign Quill Diagnostic Activity'
      find_or_create_checkbox(objective_name, user, flag) if (self.user_has_assigned_type('diagnostic'))
    when 'Assign Quill Connect Activity'
      find_or_create_checkbox(objective_name, user, flag) if (self.user_has_assigned_type('connect'))
    when 'Assign Quill Lessons Activity'
      find_or_create_checkbox(objective_name, user, flag) if (self.user_has_assigned_type('lessons'))
    when 'Assign Quill Proofreader Activity'
      find_or_create_checkbox(objective_name, user, flag) if (self.user_has_assigned_type('passage'))
    when 'Assign Quill Grammar Activity'
      find_or_create_checkbox(objective_name, user, flag) if (self.user_has_assigned_type('sentence'))
    else
      puts "You're just making it up!"
    end
  end

end
