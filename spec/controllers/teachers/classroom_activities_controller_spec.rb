require 'rails_helper'

describe Teachers::ClassroomActivitiesController, type: :controller do
  it { should use_before_filter :authorize! }
  it { should use_before_filter :teacher! }
  it { should use_before_filter :student! }
  it { should use_before_filter :authorize_student! }

  let(:classroom) { create(:classroom)}
  let(:teacher) { classroom.owner }
  let(:classroom_activity) { create(:classroom_activity, classroom_id: classroom.id)}
  let(:classroom_activity2) { create(:classroom_activity, classroom_id: classroom.id, unit_id: classroom_activity.unit.id)}
  let(:classroom_activity3) { create(:classroom_activity, classroom_id: classroom.id, unit_id: classroom_activity.unit.id)}

  before do
    allow(controller).to receive(:current_user) { teacher }
  end

  describe '#hide' do
    let!(:activity_session) { create(:activity_session, classroom_activity: classroom_activity) }
    let!(:activity_session1) { create(:activity_session, classroom_activity: classroom_activity) }

    it 'should hide the activity and kick off the set Teacher Lessons Cache' do
      expect(SetTeacherLessonCache).to receive(:perform_async).with(teacher.id)
      put :hide, id: classroom_activity.id
      expect(classroom_activity.reload.visible).to eq false
    end
  end

  describe '#launch_session' do
    let!(:milestone) { create(:milestone, name: "View Lessons Tutorial") }
    let!(:activity) { create(:activity) }

    before do
      # stubbing custom validation on creation of activity session
      allow_any_instance_of(ClassroomActivity).to receive(:validate_assigned_student) { true }
      allow(PusherLessonLaunched).to receive(:run) { true }
      classroom_activity.update(assigned_student_ids: [create(:student).id, create(:student).id])
    end

    context 'when milestone exists and activity got updated' do
      let!(:user_milestone) { create(:user_milestone, milestone: milestone, user: teacher) }
      let(:customize_lesson_url) { "#{activity.classification_form_url}customize/#{activity.uid}?&classroom_activity_id=#{classroom_activity.id}"}

      context 'when activity session exists' do
        let!(:activity_session) { create(:activity_session, classroom_activity_id: classroom_activity.id, state: "started") }
        let(:teach_class_url) { "#{activity.classification_form_url}teach/class-lessons/#{activity.uid}?&classroom_activity_id=#{classroom_activity.id}" }

        it 'should redirect to teach class lessons url' do
          get :launch_lesson, id: classroom_activity.id, lesson_uid: activity.uid
          expect(response).to redirect_to teach_class_url
        end
      end

      it 'should redirect_to customize lesson url' do
        get :launch_lesson, id: classroom_activity.id, lesson_uid: activity.uid
        expect(response).to redirect_to customize_lesson_url
      end

      it 'should kick of the pusher lesson worker and update the classroom activity' do
        expect(PusherLessonLaunched).to receive(:run).with(classroom_activity.classroom)
        get :launch_lesson, id: classroom_activity.id, lesson_uid: activity.uid
        expect(classroom_activity.reload.locked).to eq false
        expect(classroom_activity.reload.pinned).to eq true
      end
    end

    context 'when milestone exists and activity could not get updated' do
      let!(:user_milestone) { create(:user_milestone, milestone: milestone, user: teacher) }
      let(:launch_lesson_url) {  "#{ENV['DEFAULT_URL']}/tutorials/lessons?url=/teachers/classroom_activities/#{classroom_activity.id}/launch_lesson/#{activity.uid}" }

      before do
        allow_any_instance_of(ClassroomActivity).to receive(:update) { false }
      end

      it 'should redirecct to launch lesson ulr' do
        get :launch_lesson, id: classroom_activity.id, lesson_uid: activity.uid
        expect(response).to redirect_to launch_lesson_url
      end
    end

    # setting flash value without redirecting is throwing a missing partial error
    # context 'when milestone does not exist' do
      # it 'should set flash error' do
      #   get :launch_lesson, id: classroom_activity.id, lesson_uid: activity.uid, format: :json
      #   expect(flash[:error]).to eq "We cannot launch this lesson. If the problem persists, please contact support."
      # end
    # end
  end

  describe '#update' do
    it 'should be able to update due dates' do
      new_due_date = '01-01-2020'
      put :update, id: classroom_activity.id, classroom_activity: {due_date: new_due_date}
      expect(Date.parse(JSON.parse(response.body).first['due_date'])).to eq Date.parse(new_due_date)
    end
  end

  describe '#update_multiple_due_dates' do
    it 'should be able to update due dates for an array of classroom activity ids' do
      new_due_date = '01-01-2020'
      put :update_multiple_due_dates, {classroom_activity_ids: [classroom_activity.id, classroom_activity2.id, classroom_activity3.id], due_date: new_due_date}
      expect(classroom_activity.reload.due_date).to eq new_due_date
      expect(classroom_activity2.reload.due_date).to eq new_due_date
      expect(classroom_activity3.reload.due_date).to eq new_due_date
    end
  end

  describe '#activity_from_classroom_activity' do
    let(:student) { create(:student) }
    let(:activity_session_url) { "/activity_sessions/#{classroom_activity.find_or_create_started_activity_session(student.id).id}/play" }

    before do
      allow(controller).to receive(:current_user) { student }
      student.classrooms << classroom
    end

    it 'should redirect to the correct activity session url' do
      get :activity_from_classroom_activity, id: classroom_activity.id
      expect(response).to redirect_to activity_session_url
    end
  end

  describe '#lessons_activities_cache' do
    before do
      allow(teacher).to receive(:set_and_return_lessons_cache_data) { {id: "not 10"} }
    end

    context 'when value is present in the cache' do
      before do
        $redis.set("user_id:#{teacher.id}_lessons_array", {id: 10}.to_json)
      end

      it 'should render the redis cache' do
        get :lessons_activities_cache, format: :json
        expect(response.body).to eq({data: {id: 10}}.to_json)
      end
    end

    it 'should render the current users lesson cache data' do
      get :lessons_activities_cache, format: :json
      expect(response.body).to eq({data: { id: "not 10"}}.to_json)
    end
  end

  describe '#lessons_units_and_activities' do
    before do
      $redis.set("user_id:#{teacher.id}_lessons_array", [{ activity_id: 10, activity_name: "some name", completed: false }].to_json)
    end

    it 'should return the activity id in the cache' do
      get :lessons_units_and_activities
      expect(response.body).to eq({data: [{ activity_id: 10, name: "some name", completed: false }]}.to_json)
    end
  end

end
