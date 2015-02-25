require_relative '../teachers'

module Teachers
  class ClassManagerPage < Page
    def self.path
      Teachers.classrooms_path
    end

    [['Create a Class',  :create_class],
     ['Invite Students', :invite_students],
     ['Manage Classes',  :manage_classes]].each do |pair|
      text, sym = pair

      module_eval_str __LINE__, %{
        def has_#{sym}?
          has_link? '#{text}'
        end
      }
    end

    [['Activity Planner', :activity_planner],
     ['Class Manager',    :class_manager],
     ['Scorebook',        :scorebook]
    ].each do |pair|
      text, sym = pair

      module_eval_str __LINE__, %{
        def self.#{sym}_tab_pair
          #{pair}
        end

        def select_#{sym}
          click_link '#{text}'
        end
      }
    end
  end
end
