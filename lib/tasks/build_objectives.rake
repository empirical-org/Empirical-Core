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
        {name: 'Assign Entry Diagnostic', section: 'Getting Started', help_info: 'http://support.quill.org/knowledgebase/articles/1144849', action_url: '/teachers/classrooms/activity_planner/assign-a-diagnostic', section_placement: 4 },
        {name: 'Add School', section: 'Getting Started', help_info: 'http://support.quill.org/knowledgebase/articles/897621-add-your-school',  action_url: '/teachers/my_account', section_placement: 5},
        {name: 'Build Your Own Activity Pack', section: 'Other', help_info: 'http://support.quill.org/knowledgebase/articles/369614', action_url: '/teachers/classrooms/lesson_planner', section_placement: 6},
        # {name: 'View Quill Overview Tutorial', section: 'View Tutorials for Each Quill Tool', help_info: 'pending', action_url: 'pending', section_placement: 0}
        # {name: 'View Quill Diagnostic Tutorial', section: 'View Tutorials for Each Quill Tool', help_info: 'pending', action_url: 'pending', section_placement: 0}
        # {name: 'View Quill Lessons Tutorial', section: 'View Tutorials for Each Quill Tool', help_info: 'pending', action_url: 'pending', section_placement: 0}
        # {name: 'View Quill Connect Tutorial', section: 'View Tutorials for Each Quill Tool', help_info: 'pending', action_url: 'pending', section_placement: 0}
        {name: 'Assign Quill Diagnostic Activity', section: 'Assign An Activity From Each Tool', help_info: 'http://support.quill.org/knowledgebase/articles/1144849', action_url: '/teachers/classrooms/assign_activities/create-unit?tool=diagnostic', section_placement: 1},
        {name: 'Assign Quill Lessons Activity', section: 'Assign An Activity From Each Tool', help_info: '/tools/diagnostic', action_url: '/teachers/classrooms/assign_activities/create-unit?tool=lessons', section_placement: 2},
        {name: 'Assign Quill Connect Activity', section: 'Assign An Activity From Each Tool', help_info: '/tools/connect', action_url: '/teachers/classrooms/assign_activities/create-unit?tool=connect', section_placement: 3},
        {name: 'Assign Quill Proofreader Activity', section: 'Assign An Activity From Each Tool', help_info: '/tools/proofreader', action_url: '/teachers/classrooms/assign_activities/create-unit?tool=passage', section_placement: 4},
        {name: 'Assign Quill Grammar Activity', section: 'Assign An Activity From Each Tool', help_info: '/tools/grammar', action_url: '/teachers/classrooms/assign_activities/create-unit?tool=sentence', section_placement: 5},
        {name: 'Complete 10 Activities', section: 'Complete Activities With Your Students', help_info: 'http://support.quill.org/knowledgebase/articles/369689', action_url: '/teachers/classrooms/activity_planner/assign-new-activity', section_placement: 1},
        {name: 'Complete 100 Activities', section: 'Complete Activities With Your Students', help_info: 'http://support.quill.org/knowledgebase/articles/369689', action_url: '/teachers/classrooms/activity_planner/assign-new-activity', section_placement: 2},
        {name: 'Complete 250 Activities', section: 'Complete Activities With Your Students', help_info: 'http://support.quill.org/knowledgebase/articles/369689', action_url: '/teachers/classrooms/activity_planner/assign-new-activity', section_placement: 3},
        {name: 'Complete 500 Activities', section: 'Complete Activities With Your Students', help_info: 'http://support.quill.org/knowledgebase/articles/369689', action_url: '/teachers/classrooms/activity_planner/assign-new-activity', section_placement: 4},
        {name: 'Complete 1000 Activities', section: 'Complete Activities With Your Students', help_info: 'http://support.quill.org/knowledgebase/articles/369689', action_url: '/teachers/classrooms/activity_planner/assign-new-activity', section_placement: 5},
        {name: 'Start Trial', section: 'Use Quill Premium', help_info: '/premium', action_url: '/premium', section_placement: 1},
        {name: 'View Standard Reports', section: 'Use Quill Premium', help_info: '/premium', action_url: '/premium', section_placement: 2},
        {name: 'View Concept Reports', section: 'Use Quill Premium', help_info: '/premium', action_url: '/premium', section_placement: 3},
        {name: 'Download CSV of Report', section: 'Use Quill Premium', help_info: '/premium', action_url: '/premium', section_placement: 4},
        {name: 'Activate Premium', section: 'Use Quill Premium', help_info: '/premium', action_url: '/premium', section_placement: 5}
      ]
    end

    def self.find_or_create_objectives
      data.map do |obj|
        objective = Objective.find_or_create_by(name: obj[:name])
        objective.update(section: obj[:section], help_info: obj[:help_info], action_url: obj[:action_url], section_placement: obj[:section_placement])
      end
    end
  end

end
