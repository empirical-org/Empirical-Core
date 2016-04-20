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
    eventually { expect(page).to have_content(student.classrooms[0].teacher.name) }
    eventually { expect(page).to have_content(student.classrooms[1].teacher.name) }
  end

  it 'by default includes unit name of unit from last classroom added ' do
    eventually { expect(page).to have_content(unit1.name) }
  end

  it 'includes activity name for unstarted activity_session' do
    expect(page).to have_content(as2.activity.name)
  end

  it 'includes activity name for finished activity_session' do
    expect(page).to have_content(as1.activity.name)
  end

  context 'when the non-default classroom is active'

    before :each do
      page.find(:xpath,"//*[text()='#{student.classrooms[0].teacher.name}']").click
    end

    it 'does not show assigned activity from first classroom added if multiple classrooms exist' do
      expect(page).not_to have_content(as1.activity.name)
    end

    it 'does not include unit name of unit from first classroom added' do
      expect(page).not_to have_content(unit1.name)
    end

    it 'includes activity name for unstarted activity_session from the newly selected classroom' do
      expect(page).to have_content(as3_unstarted.activity.name)
    end

    it 'includes activity name for finished activity_session from the newly selected classroom' do
        expect(page).to have_content(as3_finished.activity.name)
    end

end
