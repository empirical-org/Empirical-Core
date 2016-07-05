require 'rails_helper'

describe 'Teacher Manage-Class page' do
  let(:mr_kotter) { FactoryGirl.create :mr_kotter }

  context 'for an existing class with students' do
    include_context :ms_sorter_and_sort_fodder

    let(:manage_class_page) { Teachers::ManageClassPage.new(sort_fodder) }

    context 'when signed in as the Teacher' do
      before(:each) do
        sign_in_user ms_sorter
        manage_class_page.visit
      end

      it 'shows the students, sorted by (last, first) name', retry: 3 do
        expected_rows = sort_fodder_sorted.map do |student|
          [student.name,
           student.username]
        end
        expect(manage_class_page.student_rows).to eq expected_rows
      end

      context 'for an individual student' do
        before(:each) do
          first('.user').click_link('Edit Account')
        end

        # TODO: figure out how to find the digest of arbitrary strings
        # it 'the teacher can reset the students password' do
        #   
        #   sort_fodder_sorted.first.password = 'test'
        #   click_button('Reset Password')
        #   expect(sort_fodder_sorted.first.password).to eq sort_fodder_sorted.first.last_name
        # end

        it 'the teacher can remove the student from the classroom', js: true do
           num = sort_fodder_sorted.first.students_classrooms.count
           click_button('Remove From Classroom')
           page.evaluate_script('window.confirm = function() { return true; }')
           expect(sort_fodder_sorted.first.students_classrooms.count).to eq (num-1)
        end
      end
    end
  end
end
