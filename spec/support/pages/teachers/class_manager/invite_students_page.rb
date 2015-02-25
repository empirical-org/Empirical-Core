require_relative './class_manager_page'

module Teachers
  class InviteStudentsPage < ClassManagerPage
    def self.path(classroom)
      "#{Teachers.classroom_path(classroom)}/invite_students"
    end

    def class_code
      find(:xpath, %q(//*[@class='class-code']/following-sibling::input)).value
    end

    def path(classroom)
      self.class.path(classroom)
    end

    def selected_class
      find(:css, 'button').text
    end
  end
end
