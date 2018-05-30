namespace :objectives do
  desc 'create objectives'
  task :create => :environment do
    ObjectiveCreator::find_or_create_objectives
  end

  desc 'match objectives to existing users'
  task :match_with_existing_users => :environment do
    User.where(role:'teacher').each{|teacher| TestForEarnedCheckboxesWorker.perform_async(teacher.id)}
  end


  module ObjectiveCreator
    def self.data
       [{name: 'Create a Classroom', section: 'Getting Started', help_info: 'https://support.quill.org/getting-started-for-teachers/manage-classes/how-do-i-create-classes', action_url: '/teachers/classrooms/new', section_placement: 1 },
        {name: 'Add Students', section: 'Getting Started', help_info: 'https://support.quill.org/getting-started-for-teachers/manage-classes/how-do-i-invite-students-to-my-classes', action_url: '/teachers/add_students', section_placement: 2 },
        {name: 'Assign Featured Activity Pack', section: 'Getting Started', help_info: 'https://support.quill.org/quill-org/getting-started-for-teachers/assigning-activities/how-can-i-assign-a-featured-activity-pack', action_url: '/activities/packs', section_placement: 3 },
        {name: 'Assign Entry Diagnostic', section: 'Getting Started', help_info: 'https://support.quill.org/getting-started-for-teachers/assigning-activities/how-can-i-assign-a-quill-diagnostic', action_url: '/teachers/classrooms/activity_planner/assign-a-diagnostic', section_placement: 4 },
        {name: 'Add School', section: 'Getting Started', help_info: 'http://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-add-my-school',  action_url: '/teachers/my_account', section_placement: 5},
        {name: 'Build Your Own Activity Pack', section: 'Other', help_info: 'http://support.quill.org/getting-started-for-teachers/assigning-activities/create-and-assign-your-own-activity-pack', action_url: '/teachers/classrooms/lesson_planner', section_placement: 6}]
    end

    def self.find_or_create_objectives
      data.map do |obj|
        objective = Objective.find_or_create_by(name: obj[:name])
        objective.update(section: obj[:section], help_info: obj[:help_info], action_url: obj[:action_url], section_placement: obj[:section_placement])
      end
    end
  end

end
