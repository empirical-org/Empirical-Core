require 'rails_helper'
include AsyncHelper

feature 'Profile', js: true do
  include_context "profile"



  before :each do

    vcr_ignores_localhost
    sign_in_user student
    visit('/')
  end

  it 'includes all teachers names' do
    expect(page).to have_content(student.classrooms[0].teacher.name)
    expect(page).to have_content(student.classrooms[1].teacher.name)
  end

  it 'includes unit name of unit from last classroom added by default' do
    eventually { expect(page).to have_content(unit1.name) }
  end

  it 'does not include unit name of unit from first classroom added by default' do
    eventually { expect(page).to have_content(unit1.name) }
  end

  it 'includes activity name for unstarted activity_session' do
    expect(page).to have_content(as2.activity.name)
  end

  it 'includes activity name for finished activity_session' do
    expect(page).to have_content(as1.activity.name)
  end

  it 'does not include activity name from '

end
