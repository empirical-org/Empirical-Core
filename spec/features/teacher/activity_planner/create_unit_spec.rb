require 'rails_helper'

feature 'Teacher Activity Planner - Create a Unit', js: true do
  let(:lesson_planner_page) { Teachers::LessonPlannerPage.visit }

  context 'given a selectable Activity' do
    let!(:activity) { FactoryGirl.create(:activity, flags: [:production]) }

    context 'and a classroom with students' do
      include_context :ms_sorter_and_sort_fodder

      context 'when signed in as the Teacher' do
        before(:each) do
          vcr_ignores_localhost
          sign_in_user sort_fodder.teacher
        end

        it 'shows the students, sorted by last name' do
          lesson_planner_page.create_unit 'some new unit name',
                                          activity

          lesson_planner_page.show_students

          expect(lesson_planner_page.students)
            .to eq sort_fodder_sorted.map(&:name)
        end
      end
    end
  end
end
