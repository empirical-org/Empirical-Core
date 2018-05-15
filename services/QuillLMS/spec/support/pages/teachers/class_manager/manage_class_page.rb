require_relative './class_manager_page'

module Teachers
  class ManageClassPage < ClassManagerPage
    attr_accessor :classroom

    def initialize(classroom)
      @classroom = classroom
    end

    def path
      "#{Teachers.classroom_path(classroom)}/students"
    end

    def student_rows
      all('table.students tbody tr').map do |tr|
        [tr.find('td.name').text, tr.find('td.username').text]
      end
    end

    def visit
      page.visit path
    end
  end
end
