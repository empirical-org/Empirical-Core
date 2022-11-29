# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Activity Pack Assignment' do
  include AuthenticationHelper

  let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
  let!(:teacher_info) { create(:teacher_info, user: teacher) }
  let!(:student) { teacher.students.first }
  let!(:classroom) { student.classrooms.first }

  let!(:activity_landing_page_instructions) { 'You’re about to answer 1 questions on writing sentences.' }
  let!(:activity_landing_page_html) do
    <<-HTML
      <h3><strong>Baseline Diagnostic</strong></h3>
      <p>#{activity_landing_page_instructions}</p>
      <p>
        <br/>
        Some of the questions might be about things you haven’t learned yet—that’s okay!
        Just answer them as best as you can.  Don’t forget to read the instructions carefully for each question!
      </p>
      <p>
        <br/>
        Once you’re finished, Quill will create a learning plan just for you.
      </p>
    HTML
  end

  let!(:activity_data) do
    {
      "flag" => "archived",
      "name" => activity_name,
      "questions" => [{"key"=>question_uid, "questionType"=> "fillInBlank"}],
      "landingPageHtml"=> activity_landing_page_html
    }
  end
  let!(:activity_name) { 'Starter Baseline Diagnostic (Pre)' }
  let!(:activity) { create(:diagnostic_activity, id: Activity::STARTER_DIAGNOSTIC_ACTIVITY_ID, data: activity_data) }

  let!(:question_uid) { 'CIxOvSep_iXq1pzQ5QnENA' }
  let!(:question_type) { Question::TYPE_DIAGNOSTIC_FILL_IN_BLANKS }
  let!(:question_data) do
    {
      "cues"=>["don't", "doesn't"],
      "flag"=> "archived",
      "prompt"=>"He ___ like to wake up early.",
      "conceptID"=> nil,
      "cuesLabel"=>"action words",
      "blankAllowed"=>false,
      "instructions"=> question_instructions,
      "caseInsensitive"=>true
    }
  end
  let!(:question_instructions) { 'Fill in the blank with the action word that matches the rest of the sentence.' }
  let!(:question) { create(:question, uid: question_uid, question_type: question_type, data: question_data) }

  let!(:unit_template) { create(:unit_template, id: 99, name: activity_name) }

  before { student.update(password: 'password') }

  it 'teachers can assign an activity packs to their students', :js, retry: 3 do
    login_user(teacher.email, teacher.password)
    click_button "Let's go!"
    click_on 'Student Reports'
    click_on 'Diagnostics'
    click_on 'Assign a diagnostic'
    first(:button, 'Select').click
    find('span.all-classes-text', text: 'All classes and students').sibling('span').click
    # the following line checks for the presence of an element that only loads once activity data has loaded, ensuring that the assign click will be successful
    first('.review-activities-data-table-section').click
    click_on 'Assign pack to classes'

    # TODO: Fix bug in which you can click too fast and break this flow (remove sleep when that is done)
    sleep 2
    click_on 'Next'
    click_on 'Take me to my dashboard'
    logout_user(teacher)

    login_user(student.username, student.password)
    click_on classroom.name
    click_on 'Start'
    expect(page).to have_content activity_landing_page_instructions
    click_on 'Begin'
    expect(page).to have_content question_instructions
    click_on 'Save and exit'
  end
end
