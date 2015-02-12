require_relative '../../page'

module Teachers
  module Classrooms
    class InviteStudentsPage < Page
      def class_code
        find(:xpath, %q(//*[@class='class-code']/following-sibling::input)).value
      end

      def selected_class
        find(:css, 'button').text
      end
    end
  end
end
