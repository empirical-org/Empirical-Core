# frozen_string_literal: true

require 'rails_helper'

describe ProfilesController, type: :controller do
  describe 'as a student' do
    let!(:classroom) {create(:classroom)}
    let!(:student) { create(:student) }
    let!(:students_classrooms) do
      create(:students_classrooms,
        student: student,
        classroom: classroom
      )
    end
    let!(:other_student) {create(:student)}
    let!(:units) do [
        create(:unit),
        create(:unit)
      ]
    end
    let!(:post_test) { create(:activity) }
    let!(:activities) do [
        create(:activity),
        create(:activity, follow_up_activity_id: post_test.id),
        create(:activity),
        create(:activity),
        post_test
      ]
    end
    let!(:unit_activities) do [
        create(:unit_activity, unit: units[0], activity: activities[0], order_number: 3),
        create(:unit_activity, unit: units[0], activity: activities[1], order_number: 2),
        create(:unit_activity, unit: units[0], activity: activities[2], order_number: 1),
        create(:unit_activity, unit: units[1], activity: activities[3], order_number: 2),
        create(:unit_activity, unit: units[1], activity: activities[4], order_number: 1),
      ]
    end
    let!(:classroom_units) do [
        create(:classroom_unit,
          unit: units[0],
          classroom: classroom,
          assigned_student_ids: [student.id]
        ),
        create(:classroom_unit,
          unit: units[1],
          classroom: classroom,
          assigned_student_ids: [student.id]
        )
      ]
    end
    let!(:classroom_unit_activity_states) do [
        create(:classroom_unit_activity_state, unit_activity: unit_activities[0], classroom_unit: classroom_units[0], locked: true),
        create(:classroom_unit_activity_state, unit_activity: unit_activities[1], classroom_unit: classroom_units[0]),
        create(:classroom_unit_activity_state, unit_activity: unit_activities[2], classroom_unit: classroom_units[0], pinned: true),
        create(:classroom_unit_activity_state, unit_activity: unit_activities[3], classroom_unit: classroom_units[1], locked: true),
        create(:classroom_unit_activity_state, unit_activity: unit_activities[4], classroom_unit: classroom_units[1])
      ]
    end
    let!(:activity_sessions) do [
        create(:activity_session, classroom_unit: classroom_units[0], user: student, visible: true, activity: activities[1], percentage: 0.9)
      ]
    end

    before do
      session[:user_id] = student.id
    end

    it 'redirects to the student classes page' do
      get :show
      expect(response.status).to eq(302)
    end

    context '#students_classrooms_json' do
      it 'should return a list of classes the current user is in' do
        student = create(:student_in_two_classrooms_with_many_activities)
        session[:user_id] = student.id
        get :students_classrooms_json

        student_classrooms = []
        student.classrooms.each do |classroom|
          student_classrooms << {
            'name' => classroom.name,
            'teacher' => classroom.owner.name,
            'id' => classroom.id
          }
        end

        actual_responses = JSON.parse(response.body)['classrooms']
        student_classrooms.each do |student_classroom|
          expect(actual_responses).to include(student_classroom)
        end
      end
    end

    context "#student_profile_data" do

      it "returns an error when the current user has no classrooms" do
        session[:user_id] = other_student.id
        get :student_profile_data
        expect(JSON.parse(response.body)['error']).to be
      end

      context 'when the student has a single classroom' do
        it "returns student, classroom, and teacher info when the current user has classrooms" do
          get :student_profile_data
          response_body = JSON.parse(response.body)
          expect(student.classrooms.count).to eq(1)
          students_classroom = student.classrooms.first
          expect(response_body['student']).to eq({
            'name' => student.name,
            'classroom' => {
              'name' => students_classroom.name,
              'id' => students_classroom.id,
              'teacher' => {
                'name' => students_classroom.owner.name
              }
            }
          })
        end
      end

      context 'when the student is in multiple classrooms' do
        it 'returns correct student, classrooms, and teachers info based on current_classroom_id' do
          classroom = student.classrooms.first
          get :student_profile_data, params: { current_classroom_id: classroom.id }
          response_body = JSON.parse(response.body)
          expect(response_body['student']).to eq({
            'name' => student.name,
            'classroom' => {
              'name' => classroom.name,
              'id' => classroom.id,
              'teacher' => {
                'name' => classroom.owner.name
              }
            }
          })
        end

        it 'sorts pinned activities to the front' do
          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          pinned_flags = scores.map { |score| score['pinned'].to_s }
          expect(pinned_flags).to eq(pinned_flags.sort.reverse)
        end

        it 'sorts locked activities to the end when there are no pins' do
          classroom_unit_activity_states.each do |activity_state|
            activity_state.pinned = false
            activity_state.save
          end
          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          locked_flags = scores.map { |score| score['locked'].to_s }
          expect(locked_flags).to eq(locked_flags.sort)
        end

        it 'sorts activities within blocks of those that share the same unit when there are no pins or locks' do
          classroom_unit_activity_states.each do |activity_state|
            activity_state.pinned = false
            activity_state.locked = false
            activity_state.save
          end
          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          unit_created_at_times = scores.map { |score| score['unit_created_at'] }
          expect(unit_created_at_times).to eq(unit_created_at_times.sort)
        end

        it 'sorts activities that have not been started before those that have been completed when there are no pins or locks and the activities are part of the same unit' do
          classroom_unit_activity_states.each do |activity_state|
            activity_state.pinned = false
            activity_state.locked = false
            activity_state.save
          end
          # Note that our current sorting algorithm uses "max_percentage" as a weak proxy for this
          # It may ultimately result in some unexpected behavior
          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          single_unit_scores = scores.select { |item| item['unit_id'] == units[0].id }
          max_percentages = single_unit_scores.map { |score| score['max_percentage'] }.compact
          expect(max_percentages).to eq(max_percentages.sort.reverse)
        end

        it 'respects assigned "order_number" when there are no pins or locks and all activities belong to the same unit and have the same level of completion' do
          classroom_unit_activity_states.each do |activity_state|
            activity_state.pinned = false
            activity_state.locked = false
            activity_state.save
          end
          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          single_unit_scores = scores.select { |item| item['unit_id'] == units[0].id }
          single_unit_scores = scores.reject { |item| item['max_percentage'].nil? }
          order_numbers = single_unit_scores.map { |score| score['order_number'] }
          expect(order_numbers).to eq(order_numbers.sort)
        end

        it 'returns student scores in the correct order' do
          # This test attempts to do a complex, total sorting algorithm comparison
          # It's probably doing too much in one place, but the coverage is nice

          get :student_profile_data
          scores = JSON.parse(response.body)['scores']
          relevant_classroom = student.classrooms.last
          scores_array = []
          relevant_classroom.classroom_units.each do |classroom_unit|
            unit = classroom_unit.unit
            unit.unit_activities.each do |unit_activity|
              activity = unit_activity.activity
              activity_session = classroom_unit.activity_sessions
                .find_by(user: student, activity: activity)
              state = ClassroomUnitActivityState.find_by(
                classroom_unit: classroom_unit,
                unit_activity: unit_activity
              )
              pre_test = Activity.find_by(follow_up_activity_id: activity.id)
              pre_test_completed_session = ActivitySession.find_by(state: 'finished', activity: pre_test, user: student)

              scores_array << {
                'name' => activity.name,
                'description' => activity.description,
                'repeatable' => activity.repeatable,
                'activity_classification_id' => activity.activity_classification_id,
                'activity_classification_key' => activity.classification.key,
                'unit_id' => unit.id,
                'ua_id' => unit_activity.id,
                'unit_created_at' => unit.created_at,
                'unit_name' => unit.name,
                'classroom_unit_id' => classroom_unit.id,
                'marked_complete' => false,
                'activity_id' => activity.id,
                'act_sesh_updated_at' => activity_session&.updated_at,
                'completed_date' => activity_session&.completed_at,
                'order_number' => unit_activity.order_number,
                'due_date' => unit_activity.due_date,
                'pre_activity_id' => pre_test&.id,
                'unit_activity_created_at' => classroom_unit.created_at,
                'user_pack_sequence_item_status' => nil,
                'locked' => unit_activity.classroom_unit_activity_states[0].locked,
                'pinned' => unit_activity.classroom_unit_activity_states[0].pinned,
                'max_percentage' => activity_session&.percentage,
                'completed_pre_activity_session' => pre_test_completed_session.present?,
                'finished' => activity_session&.percentage ? true : false,
                'resume_link' => activity_session&.state == 'started' ? 1 : 0,
                'closed' => false
              }
            end
          end

          # This sort emulates the sort we are doing in the student_profile_data_sql method.
          sorted_scores = scores_array.sort { |a, b|
            [
              b['pinned'].to_s, a['locked'].to_s, a['unit_created_at'], a['max_percentage'] || 1.01, a['order_number'], a['unit_activity_created_at']
            ] <=> [
              a['pinned'].to_s, b['locked'].to_s, b['unit_created_at'], b['max_percentage'] || 1.01, b['order_number'], b['unit_activity_created_at']
            ]
          }

          expect(scores).to eq sanitize_hash_array_for_comparison_with_sql(sorted_scores)
        end

        it 'returns next activity session' do
          get :student_profile_data
          response_body = JSON.parse(response.body)
          expect(response_body['next_activity_session']).to eq(response_body['scores'].first)
        end
      end
    end
  end
end
