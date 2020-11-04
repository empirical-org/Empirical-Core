require 'rails_helper'

describe TeacherSavedActivitiesController do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#saved_activity_ids_for_current_user' do
    it 'should return a list of activity ids the user has saved' do
      activity_1 = create(:activity)
      activity_2 = create(:activity)
      TeacherSavedActivity.create(activity: activity_1, teacher: user)
      TeacherSavedActivity.create(activity: activity_2, teacher: user)
      get :saved_activity_ids_for_current_user
      expect(response.body).to eq({ activity_ids: [activity_1.id, activity_2.id]}.to_json)
      expect(response.status).to be(200)
    end
  end

  describe '#create_by_activity_id_for_current_user' do
    it 'should create a new teacher saved activity for that activity and the current user' do
      activity_1 = create(:activity)
      post :create_by_activity_id_for_current_user, { activity_id: activity_1.id}
      expect(TeacherSavedActivity.find_by(teacher: user, activity: activity_1)).to be
      expect(response.status).to be(200)
    end
  end

  describe '#destroy_by_activity_id_for_current_user' do
    describe 'when the teacher saved activity exists' do
      it 'should destroy the teacher saved activity for that activity and the current user' do
        activity_1 = create(:activity)
        TeacherSavedActivity.create(activity: activity_1, teacher: user)
        delete :destroy_by_activity_id_for_current_user, { activity_id: activity_1.id}
        expect(TeacherSavedActivity.find_by(teacher: user, activity: activity_1)).not_to be
        expect(response.status).to be(200)
      end
    end

    describe 'when the teacher saved activity does not exist' do
      it 'should not error' do
        activity_1 = create(:activity)
        delete :destroy_by_activity_id_for_current_user, { activity_id: activity_1.id}
        expect(response.status).to be(200)
      end
    end
  end


end
