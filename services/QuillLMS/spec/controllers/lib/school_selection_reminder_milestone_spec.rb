# frozen_string_literal: true

require 'rails_helper'

class FakeController < ApplicationController
  include SchoolSelectionReminderMilestone
end

describe FakeController, type: :controller do

  describe 'show_school_selection_reminders' do
    let!(:milestone) { create(:dismiss_school_selection_reminder) }
    let!(:user) { create(:teacher) }
    let!(:no_school_selected_school) { create(:school, name: School::NO_SCHOOL_SELECTED_SCHOOL_NAME) }
    let!(:school) { create(:school) }

    context 'if there is no current user' do
      it 'should return false' do
        expect(controller.show_school_selection_reminders).to be(false)
      end
    end

    context 'if there is a current user' do
      before do
        session[:user_id] = user.id
      end

      it 'should return true if they do not have a school' do
        expect(controller.show_school_selection_reminders).to be(true)
      end

      it 'should return true if they have no school selected as their school' do
        SchoolsUsers.create(school: no_school_selected_school, user: user)
        expect(controller.show_school_selection_reminders).to be(true)
      end

      it 'should return false if they have a school' do
        SchoolsUsers.create(school: school, user: user)
        expect(controller.show_school_selection_reminders).to be(false)
      end

      it 'should return false if they have the user milestone for dismissing the school selection reminder' do
        UserMilestone.create(milestone: milestone, user: user)
        expect(controller.show_school_selection_reminders).to be(false)
      end

    end

  end
end
