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
  let!(:cu) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [user1.id])}
  let!(:ua) { create(:unit_activity, unit: cu.unit, activity: activity)}
  let!(:activity_session) { create(:activity_session, user: user1, activity: activity, classroom_unit: cu, state: 'unstarted') }
  let(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end


  describe '#play' do
      before do
        allow_any_instance_of(Activity).to receive(:activity_classification_id) { 3 }
      end
      it 'should redirect to module url' do
        get :play, params: { id: activity_session.id }
        expect(response).to redirect_to activity.module_url(activity_session)
      end
  end

  describe '#result' do
    it 'should set the activity results classroom_id' do
      get :result, params: { uid: activity_session.uid }
      expect(assigns(:activity)).to eq activity_session
      expect(assigns(:results)).to eq activity_session.parse_for_results
      expect(assigns(:classroom_id)).to eq activity_session.classroom_unit.classroom_id
    end

    it 'should allow iFrames for this endpoint' do
      get :result, params: { uid: activity_session.uid }
      expect(response.headers).not_to include('X-Frame-Options')
    end

    it 'shouldnt error unfound sessions' do
      get :result, params: { uid: 923123213123123123 }

      expect(response.code).to eq("404")
    end
  end

  describe '#anonymous' do
    context 'activity with classification key lessons' do
      before do
        allow_any_instance_of(ActivityClassification).to receive(:key) { "lessons" }
      end

      it 'should assign the activity' do
        get :anonymous, params: { activity_id: activity.id }
        expect(assigns(:activity)).to eq activity
      end

      it 'should redirect to preview lesson url' do
        get :anonymous, params: { activity_id: activity.id }
        expect(response).to redirect_to "#{ENV['DEFAULT_URL']}/preview_lesson/#{activity.uid}"
      end
    end

    context 'activity without classification key lessons' do
      before do
        allow_any_instance_of(ActivityClassification).to receive(:key) { "not lessons" }
      end

      it 'should redirect to anonymous module url' do
        get :anonymous, params: { activity_id: activity.id }
        expect(response).to redirect_to activity.anonymous_module_url.to_s
      end
    end
  end

  describe '#activity_session_from_classroom_unit_and_activity' do
    let(:student) { create(:student) }
    let(:activity_session_url) { "/activity_sessions/#{ActivitySession.find_or_create_started_activity_session(student.id, cu.id, activity.id).id}/play" }

    before do
      allow(controller).to receive(:current_user) { student }
      student.classrooms << classroom
    end

    it 'should redirect to the correct activity session url' do
      get :activity_session_from_classroom_unit_and_activity, params: { classroom_unit_id: cu.id, activity_id: activity.id }
      expect(response).to redirect_to activity_session_url
    end
  end

end
