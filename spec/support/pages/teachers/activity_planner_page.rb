require_relative '../page'
require_relative './teachers'

module Teachers
  class LessonPlannerPage < Page
    def self.path
      "#{Teachers.classrooms_path}/lesson_planner"
    end


    def create_unit(name, activity)
      find(:xpath, "//a[text()='Create a Unit']").click

      fill_in :unit_name, with: name
      find("label#activity_#{activity.id}", visible: false).click

      click_on :continue
    end

    def show_students
      find(:xpath, "//*[text()='Select by Student']").click
    end

    def students
      all('.student_column label').map(&:text)
    end
  end
end
