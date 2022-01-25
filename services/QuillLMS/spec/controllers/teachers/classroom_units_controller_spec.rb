# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ClassroomUnitsController, type: :controller do
  it { should use_before_action :authorize! }
  it { should use_before_action :teacher! }

  let(:classroom) { create(:classroom)}
  let(:teacher) { classroom.owner }
  let(:classroom_unit) { create(:classroom_unit, classroom_id: classroom.id)}
  let(:classroom_unit2) { create(:classroom_unit, classroom_id: classroom.id, unit_id: classroom_unit.unit.id)}
  let(:classroom_unit3) { create(:classroom_unit, classroom_id: classroom.id, unit_id: classroom_unit.unit.id)}
  let!(:activity_classification) { create(:lesson_classification) }
  let!(:activity) { create(:activity, activity_classification_id: activity_classification.id ) }

  context "with teacher" do
    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    describe '#launch_lesson' do
      let!(:milestone) { create(:milestone, name: "View Lessons Tutorial") }

      before do
        # stubbing custom validation on creation of activity session
        allow_any_instance_of(ClassroomUnit).to receive(:validate_assigned_student) { true }
        allow(PusherLessonLaunched).to receive(:run) { true }
        classroom_unit.update(assigned_student_ids: [create(:student).id, create(:student).id])
      end

      context 'when milestone exists and activity got updated' do
        let!(:user_milestone) { create(:user_milestone, milestone: milestone, user: teacher) }
        let!(:unit_activity) { create(:unit_activity, activity: activity, unit: classroom_unit.unit)}
        let!(:cuas) { create(:classroom_unit_activity_state, unit_activity: unit_activity, classroom_unit: classroom_unit)}

        let(:customize_lesson_url) { "#{activity.classification_form_url}customize/#{activity.uid}?&classroom_unit_id=#{classroom_unit.id}"}

        context 'when activity session exists' do
          let!(:activity_session) { create(:activity_session, classroom_unit_id: classroom_unit.id, state: "started") }
          let(:teach_class_url) { "#{activity.classification_form_url}teach/class-lessons/#{activity.uid}?&classroom_unit_id=#{classroom_unit.id}" }

          it 'should redirect to teach class lessons url' do
            get :launch_lesson, params: { id: classroom_unit.id, lesson_uid: activity.uid }
            expect(response).to redirect_to teach_class_url
          end
        end

        it 'should redirect_to customize lesson url' do
          get :launch_lesson, params: { id: classroom_unit.id, lesson_uid: activity.uid }
          expect(response).to redirect_to customize_lesson_url
        end

        it 'should kick of the pusher lesson worker and update the classroom unit activity state' do
          expect(PusherLessonLaunched).to receive(:run).with(classroom_unit.classroom)
          get :launch_lesson, params: { id: classroom_unit.id, lesson_uid: activity.uid }
          expect(cuas.reload.locked).to eq false
          expect(cuas.reload.pinned).to eq true
        end
      end

      context 'when milestone exists and activity could not get updated' do
        let!(:user_milestone) { create(:user_milestone, milestone: milestone, user: teacher) }

        before { allow_any_instance_of(ClassroomUnit).to receive(:update) { false } }

        it 'should redirect back to the referrer' do
          request.env["HTTP_REFERER"] = '/'
          get :launch_lesson, params: { id: classroom_unit.id, lesson_uid: activity.uid }
          expect(response).to redirect_to '/'
        end
      end
    end

    describe '#lessons_activities_cache' do
      before { allow(teacher).to receive(:set_and_return_lessons_cache_data) { { id: "not 10" } } }

      context 'when value is present in the cache' do
        before { $redis.set("user_id:#{teacher.id}_lessons_array", { id: 10 }.to_json) }

        it 'should render the redis cache' do
          get :lessons_activities_cache, as: :json
          expect(response.body).to eq({data: { id: 10 } }.to_json)
        end
      end

      it 'should render the current users lesson cache data' do
        get :lessons_activities_cache, as: :json
        expect(response.body).to eq({data: { id: "not 10" }}.to_json)
      end
    end

    describe '#lessons_units_and_activities' do
      before do
        $redis.set("user_id:#{teacher.id}_lessons_array", [
          { activity_id: 10, activity_name: "some name", completed: false, visible: true },
          { activity_id: 11, activity_name: "bater papo", completed: false, visible: false }
        ].to_json)
      end

      it 'should return the activity id in the cache' do
        get :lessons_units_and_activities
        expect(response.body).to eq({data: [{ activity_id: 10, name: "some name", completed: false, visible: true }]}.to_json)
      end
    end
  end

  context "without user" do
    before { allow(controller).to receive(:current_user) { nil } }

    describe '#launch_lesson' do

      it 'should redirect to login' do
        get :launch_lesson, params: { id: classroom_unit.id, lesson_uid: activity.uid }

        expect(response).to redirect_to('/session/new')
      end
    end

    describe '#mark_lesson_as_completed' do

      it 'should redirect to login' do
        get :mark_lesson_as_completed, params: { id: classroom_unit.id, lesson_uid: activity.uid }

        expect(response).to redirect_to('/session/new')
      end
    end
  end

end
