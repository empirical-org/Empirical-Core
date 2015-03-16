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
      all('table.students tbody tr.user').map do |tr|
        row = StudentTableRow.new(tr)
        [row.name, row.username]
      end
    end

    def visit
      page.visit path
    end
  end

  class StudentTableRow
    def initialize(element)
      @element = element
    end

    %i(name username).each do |attrib|
      line_no = __LINE__; str = %{
        def #{attrib}
          @element.find('td.#{attrib}').text
        end
      }
      module_eval str, __FILE__, line_no
    end
  end
end
