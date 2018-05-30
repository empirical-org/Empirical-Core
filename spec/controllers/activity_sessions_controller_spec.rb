require 'rails_helper'

describe ActivitySessionsController, type: :controller do
  it { should use_before_action :activity_session_from_id }
  it { should use_before_action :activity_session_from_uid }
  it { should use_before_action :activity_session_for_update }
  it { should use_before_action :activity }
  it { should use_before_action :activity_session_authorize! }
  it { should use_before_action :activity_session_authorize_teacher! }
  it { should use_after_action :update_student_last_active }

  let!(:activity) { create(:activity) }
  let!(:classroom) { create(:classroom)}
  let!(:user1) { create(:user, classcode: classroom.code) }
  let!(:ca) { create(:classroom_activity, classroom: classroom, activity: activity)}
  let!(:activity_session) { create(:activity_session, user: user1, activity: activity, classroom_activity: ca, state: 'unstarted') }
  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end


  describe '#play' do
    context 'when the activity classification id is 6' do
      let(:url) { "#{ENV['FIREBASE_DATABASE_URL']}/v2/classroom_lesson_sessions/#{ca.id}/students.json" }
      let(:body) { {"#{activity_session.uid}": user.name}.to_json }

      before do
        allow(HTTParty).to receive(:patch) { true }
        allow_any_instance_of(Activity).to receive(:activity_classification_id) { 6 }
      end

      it 'should set the module url' do
        get :play, id: activity_session.id
        expect(assigns(:module_url)).to eq activity.module_url(activity_session)
      end

      it 'should call the http patch method' do
        expect(HTTParty).to receive(:patch).with(url, body: body)
        get :play, id: activity_session.id
      end
    end

    context 'when the activity classification id is not 6' do
      before do
        allow_any_instance_of(Activity).to receive(:activity_classification_id) { 3 }
      end
      it 'should redirect to module url' do
        get :play, id: activity_session.id
        expect(response).to redirect_to activity.module_url(activity_session)
      end
    end
  end

  describe '#result' do
    it 'should set the activity results classroom_id' do
      get :result, uid: activity_session.uid
      expect(assigns(:activity)).to eq activity_session
      expect(assigns(:results)).to eq activity_session.parse_for_results
      expect(assigns(:classroom_id)).to eq activity_session.classroom_activity.classroom_id
    end
  end

  describe '#anonymous' do
    context 'activity with classification key lessons' do
      before do
        allow_any_instance_of(ActivityClassification).to receive(:key) { "lessons" }
      end

      it 'should assign the activity' do
        get :anonymous, activity_id: activity.id
        expect(assigns(:activity)).to eq activity
      end

      it 'should redirect to preview lesson url' do
        get :anonymous, activity_id: activity.id
        expect(response).to redirect_to "#{ENV['DEFAULT_URL']}/preview_lesson/#{activity.uid}"
      end
    end

    context 'activity without classification key lessons' do
      before do
        allow_any_instance_of(ActivityClassification).to receive(:key) { "not lessons" }
      end

      it 'should redirect to anonymous module url' do
        get :anonymous, activity_id: activity.id
        expect(response).to redirect_to activity.anonymous_module_url.to_s
      end
    end
  end

end
