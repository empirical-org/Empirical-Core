# frozen_string_literal: true

require 'rails_helper'

describe TeacherSavedActivitiesController do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#saved_activity_ids_for_current_user' do
    it 'should return a list of activity ids the user has saved' do
      activity1 = create(:activity)
      activity2 = create(:activity)
      TeacherSavedActivity.create(activity: activity1, teacher: user)
      TeacherSavedActivity.create(activity: activity2, teacher: user)
      get :saved_activity_ids_for_current_user
      expect(response.body).to eq({ activity_ids: [activity1.id, activity2.id]}.to_json)
      expect(response.status).to be(200)
    end

    it 'should not error if the current_user is nil' do
      get :saved_activity_ids_for_current_user, current_user: nil
      expect(response.body).to eq({ activity_ids: []}.to_json)
      expect(response.status).to be(200)
    end
  end

  describe '#create_by_activity_id_for_current_user' do
    it 'should create a new teacher saved activity for that activity and the current user' do
      activity1 = create(:activity)
      post :create_by_activity_id_for_current_user, params: { activity_id: activity1.id }
      expect(TeacherSavedActivity.find_by(teacher: user, activity: activity1)).to be
      expect(response.status).to be(200)
    end
  end

  describe '#destroy_by_activity_id_for_current_user' do
    describe 'when the teacher saved activity exists' do
      it 'should destroy the teacher saved activity for that activity and the current user' do
        activity1 = create(:activity)
        TeacherSavedActivity.create(activity: activity1, teacher: user)
        delete :destroy_by_activity_id_for_current_user, params: { activity_id: activity1.id }
        expect(TeacherSavedActivity.find_by(teacher: user, activity: activity1)).not_to be
        expect(response.status).to be(200)
      end
    end

    describe 'when the teacher saved activity does not exist' do
      it 'should not error' do
        activity1 = create(:activity)
        delete :destroy_by_activity_id_for_current_user, params: { activity_id: activity1.id }
        expect(response.status).to be(200)
      end
    end
  end


end
