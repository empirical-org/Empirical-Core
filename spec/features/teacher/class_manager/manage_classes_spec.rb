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

      it 'shows the students, sorted by (last, first) name' do
        expected_rows = sort_fodder_sorted.map do |student|
          [student.name,
           student.username]
        end

        expect(manage_class_page.student_rows).to eq expected_rows
      end
    end
  end
end
