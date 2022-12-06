# frozen_string_literal: true

require 'rails_helper'

describe Teachers::UnitTemplatesController, type: :controller do
  before do
    session[:user_id] = teacher.id
  end

  it { should use_before_action :is_teacher? }
  it { should use_before_action :redirect_to_public_index_if_no_unit_template_found }

  include_context "Unit Assignments Variables"


  let(:parsed_body) { JSON.parse(response.body) }

  describe '#index, as: :json' do
    it 'responds with list of unit_templates' do
      get :index, as: :json
      expect(parsed_body['unit_templates'].length).to eq(4)
    end
  end

  describe '#fast_assign' do
    context 'creates a new unit' do
      it "can create new units and classroom activities" do
        data = {"id": unit_template1.id}
        current_jobs = FastAssignWorker.jobs.size
        post "fast_assign", params: (data)
        expect(FastAssignWorker.jobs.size).to eq(current_jobs + 1)
      end
    end
  end

  describe '#count' do
    it 'should set the count' do
      get :count, as: :json
      expect(assigns(:count)).to eq UnitTemplate.count
      expect(response.body).to eq({count: UnitTemplate.count}.to_json)
    end
  end

  describe '#profile_info' do
    before do
      allow_any_instance_of(UnitTemplate).to receive(:get_cached_serialized_unit_template) { {} }
    end

    it 'should render the correct json' do
      get :profile_info, params: { id: unit_template1.id }
      expect(response.body).to eq({
        data: {
          non_authenticated: false,
          flag: nil
        },
        referral_code: teacher.referral_code
      }.to_json)
    end
  end

  describe '#assigned_info' do
    it 'should render the correct json' do
      get :assigned_info, params: { id: unit_template1.id }, as: :json
      expect(response.body).to eq({
        name: unit_template1.name,
        last_classroom_name: teacher.classrooms_i_teach.last.name,
        last_classroom_id: teacher.classrooms_i_teach.last.id
      }.to_json)
    end
  end

  describe '#previously_assigned_activities' do
    let!(:current_user) { create(:teacher_with_a_couple_classrooms_with_one_student_each) }
    let!(:classroom) { current_user.classrooms_i_teach.first }
    let!(:unit_one) {create(:unit, user_id: current_user.id)}
    let!(:unit_two) {create(:unit, user_id: current_user.id)}
    let!(:activity_one) { create(:activity) }
    let!(:activity_two) { create(:activity) }
    let!(:activity_three) { create(:activity) }
    let!(:activity_four) { create(:activity) }
    let!(:activity_five) { create(:activity) }
    let!(:classroom_unit_one) { create(:classroom_unit, unit: unit_one, classroom: classroom, assigned_student_ids: classroom.student_ids) }
    let!(:classroom_unit_two) { create(:classroom_unit, unit: unit_two, classroom: classroom) }
    let!(:unit_activity_one) { create(:unit_activity, unit: classroom_unit_one.unit, activity: activity_one) }
    let!(:unit_activity_two) { create(:unit_activity, unit: classroom_unit_one.unit, activity: activity_two) }
    let!(:unit_activity_three) { create(:unit_activity, unit: classroom_unit_two.unit, activity: activity_two) }
    let!(:unit_activity_four) { create(:unit_activity, unit: classroom_unit_two.unit, activity: activity_three) }

    it 'should render the correct json' do
      activity_ids = [activity_one.id, activity_two.id, activity_three.id, activity_four.id, activity_five.id].to_s
      count = classroom.student_ids.length
      get :previously_assigned_activities, params: { activity_ids: activity_ids }, as: :json

      expect(response.body).to eq({
        previously_assigned_activity_data: {
          activity_one.id => [
            {
              name: unit_one.name,
              assigned_date: unit_one.created_at,
              classrooms: [classroom.name],
              students: [{
                assigned_student_count: count,
                total_student_count: count
              }]
            }
          ],
          activity_two.id => [
            {
              name: unit_one.name,
              assigned_date: unit_one.created_at,
              classrooms: [classroom.name],
              students: [{
                assigned_student_count: count,
                total_student_count: count
              }]
            },
            {
              name: unit_two.name,
              assigned_date: unit_two.created_at,
              classrooms: [classroom.name],
              students: [{
                assigned_student_count: 0,
                total_student_count: count
              }]
            }
          ],
          activity_three.id => [
            {
              name: unit_two.name,
              assigned_date: unit_two.created_at,
              classrooms: [classroom.name],
              students: [{
                assigned_student_count: 0,
                total_student_count: count
              }]
            }
          ]
        }
      }.to_json)
    end
  end
end
