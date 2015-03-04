require_relative './class_manager_page'

module Teachers
  class CreateClassPage < ClassManagerPage
    def self.path
      "#{Teachers::ClassManagerPage.path}/new"
    end

    def class_code
      find_field(:classroom_code).value
    end

    def create_class(name: '', grade: '')
      self.name  = name
      self.grade = grade

      click_on 'Create Class'
    end

    def generate_new_class_code
      find('.generate-code').click
    end

    def grade=(grade)
      select grade.to_s, from: :classroom_grade
    end

    def name=(name)
      fill_in :classroom_name, with: name
    end

    def path
      self.class.path
    end

    def select_activity_planner
      click_link 'Activity Planner'
    end

    def select_scorebook
      click_link 'Scorebook'
    end
  end
end
