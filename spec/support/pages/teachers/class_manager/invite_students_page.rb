require_relative './class_manager_page'

module Teachers
  class InviteStudentsPage < ClassManagerPage
    attr_accessor :classroom

    def initialize(classroom)
      @classroom = classroom
    end

    def class_code
      find(:xpath, %q(//*[@class='class-code']/following-sibling::input)).value
    end

    def path
      "#{Teachers.classroom_path(classroom)}/invite_students"
    end

    def selected_class
      find(:css, 'button').text
    end

    def visit
      page.visit path
    end
  end
end
