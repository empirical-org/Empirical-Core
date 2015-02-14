require_relative '../../page'

module Teachers
  module Classrooms
    class NewPage < Page
      def class_code
        find_field(:classroom_code).value
      end

      def create_class(name: '', grade: '')
        fill_in :classroom_name, with: name
        select grade, from: :classroom_grade

        click_on 'Create Class'

        InviteStudentsPage.new
      end

      def self.path
        '/teachers/classrooms/new'
      end
    end
  end
end
