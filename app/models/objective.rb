class Objective < ActiveRecord::Base


  has_many :checkboxes
  has_many :users, through: :checkboxes

  def self.handle_different_objectives(objective_name, user_id, flag=nil)
    # TODO: finish this!
    puts 'ryan here is the objective_name'
    puts objective_name
    user = User.find(user_id)
    case objective_name
    when "Create a Classroom"
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.has_classrooms?)
    when "Add Students"
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.has_student?)
    when "Add School"
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.schools.any?)
    when 'Complete 10 Activities'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 10)
    when 'Complete 100 Activities'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 100)
    when 'Complete 250 Activities'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 250)
    when 'Complete 500 Activities'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 500)
    when 'Complete 1000 Activities'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (user.total_activity_count > 1000)
    when 'Assign Quill Diagnostic Activity'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (ActivityClassification.teacher_has_assigned_type?(user_id, 'diagnostic'))
    when 'Assign Quill Connect Activity'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (ActivityClassification.teacher_has_assigned_type?(user_id, 'connect'))
    when 'Assign Quill Lessons Activity'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (ActivityClassification.teacher_has_assigned_type?(user_id, 'lessons'))
    when 'Assign Quill Proofreader Activity'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (ActivityClassification.teacher_has_assigned_type?(user_id, 'passage'))
    when 'Assign Quill Grammar Activity'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (ActivityClassification.teacher_has_assigned_type?(user_id, 'sentence'))
    when 'Start Trial'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (Subscription.unscoped.find_by_user_id(user_id).present?)
    when 'Activate Premium'
      Checkbox.find_or_create_checkbox(objective_name, user, flag) if (Subscription.unscoped.where(user_id: user_id).where.not(account_type: 'trial').limit(1).ids.any?)
    else
      puts "unable to find objective with name: #{objective_name}"
    end
  end

end
