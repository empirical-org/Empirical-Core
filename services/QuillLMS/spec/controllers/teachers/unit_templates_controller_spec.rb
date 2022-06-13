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
end
