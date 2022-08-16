# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Activity Pack Assignment' do
  let!(:teacher) { create(:teacher_with_a_couple_classrooms_with_one_student_each, name: 'Integration Teacher') }
  let!(:student) { User.student.last }

  let!(:classroom_name) { student.classrooms.first.name }

  before do
    student.update(password: 'password')
    create(:unit_template, id: 99, name: 'Starter Baseline Diagnostic (Pre)')
    create(:activity, classification: create(:diagnostic), id: Activity::STARTER_DIAGNOSTIC_ACTIVITY_ID)
  end

  it 'teachers can assign an activity packs to their students', :js do
    login_user(teacher.email, teacher.password)
    click_button "Let's go!"
    click_on 'Student Reports'
    click_on 'Diagnostics'
    click_on 'Assign a diagnostic'
    first(:button, 'Select').click
    find('span.all-classes-text', text: 'All classes and students').sibling('span').click
    click_on 'Assign pack to classes'
    click_on 'Next'
    click_on 'Take me to my dashboard'
    logout_user

    login_user(student.username, student.password)
    click_on classroom_name
    click_on 'Start'
  end

  def login_user(email_or_username, password)
    visit root_path
    click_link 'Log In'
    fill_in 'email-or-username', with: email_or_username
    fill_in 'password', with: password
    click_on 'Log in'
  end

  def logout_user
    find('img.user-dropdown-button-img').click
    click_on 'Logout'
  end
end
