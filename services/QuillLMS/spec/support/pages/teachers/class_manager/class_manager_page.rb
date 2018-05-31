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
     ['Classes',    :classes],
     ['Student Reports',        :student_reports]
    ].each do |pair|
      text, sym = pair

      module_eval_str __LINE__, %{
        def self.#{sym}_tab_pair
          #{pair}
        end

        def select_#{sym}
          first(:link, '#{text}').click
        end
      }
    end
  end
end
