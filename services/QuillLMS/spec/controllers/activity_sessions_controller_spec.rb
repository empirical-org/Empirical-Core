# frozen_string_literal: true

require 'rails_helper'

describe ActivitySessionsController, type: :controller do
  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :activity_session_from_id }
  it { should use_before_action :activity_session_from_uid }
  it { should use_before_action :activity_session_for_update }
  it { should use_before_action :activity }
  it { should use_before_action :activity_session_authorize! }
  it { should use_before_action :activity_session_authorize_teacher! }
  it { should use_before_action :redirect_if_student_has_not_completed_pre_test }
  it { should use_after_action :update_student_last_active }

  let!(:activity) { create(:activity) }
  let!(:classroom) { create(:classroom)}
  let!(:user1) { create(:user, classcode: classroom.code) }
  let!(:cu) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [user1.id])}
  let!(:ua) { create(:unit_activity, unit: cu.unit, activity: activity)}
  let!(:activity_session) { create(:activity_session, user: user1, activity: activity, classroom_unit: cu, state: 'unstarted') }
  let(:user) { create(:staff) }



  describe '#play' do
    before { allow_any_instance_of(Activity).to receive(:activity_classification_id) { 3 } }

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
      before { allow_any_instance_of(ActivityClassification).to receive(:key) { "lessons" } }

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
      before { allow_any_instance_of(ActivityClassification).to receive(:key) { "not lessons" } }

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

  describe "#redirect_if_student_has_not_completed_pre_test" do
    let!(:student) { create(:student)}
    let!(:activity) { create(:diagnostic_activity) }

    before do
      @activity = create(:diagnostic_activity)
      @controller = ActivitySessionsController.new

      allow(@controller).to receive(:current_user) { student }
      @controller.instance_variable_set(:@activity, @activity)
    end

    it 'should return if there is no activity with the @activity id as a follow_up_activity_id' do
      @activity_session = create(:activity_session, user: student, state: 'started', activity: @activity)

      get :play, params: { id: @activity_session.id }
      expect(response).not_to redirect_to(profile_path)
    end

    it 'should return if there is an activity with the @activity id as a follow_up_activity_id but that activity is not a diagnostic' do
      create(:lesson_activity, follow_up_activity_id: @activity.id)
      @activity_session = create(:activity_session, user: student, state: 'started', activity: @activity)

      get :play, params: { id: @activity_session.id }
      expect(response).not_to redirect_to(profile_path)
    end

    it 'should return if there is an activity with the @activity id as a follow_up_activity_id and it is a diagnostic but the student has already completed that activity in this classroom' do
      pre_test_activity = create(:diagnostic_activity, follow_up_activity_id: @activity.id)

      classroom = create(:classroom)
      pre_test_classroom_unit = create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id])
      post_test_classroom_unit = create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id])
      pre_test_activity_session = create(:activity_session, user: student, state: 'finished', classroom_unit: pre_test_classroom_unit, activity: pre_test_activity)
      @activity_session = create(:activity_session, user: student, state: 'started', classroom_unit: post_test_classroom_unit, activity: @activity)

      @controller.instance_variable_set(:@activity_session, @activity_session)
      get :play, params: { id: @activity_session.id }
      expect(response).not_to redirect_to(profile_path)
    end

    it 'should redirect to profile path if there is an activity with the @activity id as a follow_up_activity_id and it is a diagnostic and the student has not yet completed that activity in this classroom' do
      pre_test_activity = create(:diagnostic_activity, follow_up_activity_id: @activity.id)

      classroom = create(:classroom)
      pre_test_classroom_unit = create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id])
      post_test_classroom_unit = create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id])
      @activity_session = create(:activity_session, user: student, state: 'started', classroom_unit: post_test_classroom_unit, activity: @activity)

      @controller.instance_variable_set(:@activity_session, @activity_session)
      get :play, params: { id: @activity_session.id }
      expect(response).to redirect_to(profile_path)
    end
  end

end
