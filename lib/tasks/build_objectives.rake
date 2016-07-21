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
       [{name: 'Create a Classroom', section: 'Getting Started', help_info: 'http://support.quill.org/knowledgebase/articles/369605', action_url: '/teachers/classrooms/new', section_placement: 1 },
        {name: 'Add Students', section: 'Getting Started', help_info: 'http://support.quill.org/knowledgebase/articles/369608', action_url: '/teachers/add_students', section_placement: 2 },
        {name: 'Assign Featured Activity Pack', section: 'Getting Started', help_info: 'http://support.quill.org/knowledgebase/articles/843639', action_url: '/activities/packs', section_placement: 3 },
        {name: 'Build Your Own Activity Pack', section: 'Getting Started', help_info: 'http://support.quill.org/knowledgebase/articles/369614', action_url: '/teachers/classrooms/lesson_planner', section_placement: 4},
        {name: 'Add School', section: 'Getting Started', help_info: 'http://support.quill.org/knowledgebase/articles/897621-add-your-school',  action_url: '/teachers/my_account', section_placement: 5}]
    end

    def self.find_or_create_objectives
      data.map do |obj|
        objective = Objective.find_or_create_by(name: obj[:name])
        objective.update(section: obj[:section], help_info: obj[:help_info], action_url: obj[:action_url], section_placement: obj[:section_placement])
      end
    end
  end

end
