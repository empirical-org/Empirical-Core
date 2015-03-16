require_relative './class_manager_page'

module Teachers
  class InviteStudentsPage < ClassManagerPage
    attr_accessor :classroom

    def initialize(classroom)
      @classroom = classroom
    end

    def add_student(student)
      fill_in :user_first_name, with: student.first_name
      fill_in  :user_last_name, with: student. last_name

      click_on 'Add Student'
    end

    def class_code
      find(:xpath, %q(//*[@class='class-code']/following-sibling::input)).value
    end

    def class_menu
      find 'ul.dropdown-menu'
    end

    def class_names
      class_menu.all('li').map(&:text)
    end

    def path
      "#{Teachers.classroom_path(classroom)}/invite_students"
    end

    def select_class(class_name)
      class_menu.click_link class_name
    end

    def selected_class
      find(:css, 'button').text
    end

    def student_count
      student_table.all('tr.user').count
    end

    def student_row(student)
      StudentTableRow.new student_table.find_by_id "user_#{student.id}"
    end

    def student_table
      find 'table.students'
    end

    def student_table_rows
      student_table.all('tbody tr').map do |tr|
        row = StudentTableRow.new(tr)
        [row.first_name, row.last_name, row.username]
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

    %i(first_name last_name username).each do |attrib|
      line_no = __LINE__; str = %{
        def #{attrib}
          @element.find('td.#{attrib}').text
        end
      }
      module_eval str, __FILE__, line_no
    end
  end
end
