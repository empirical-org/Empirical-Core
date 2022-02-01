# frozen_string_literal: true

require 'rails_helper'

describe ClassroomsTeachersController, type: :controller do
  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :signed_in! }
  it { should use_before_action :multi_classroom_auth }

  let(:user) { create(:user) }


  describe '#edit_coteacher_form' do
    let(:classroom) { create(:classroom) }
    let(:edit_info_for_teacher) do
      {
        is_coteacher: [classroom.id],
        invited_to_coteach: [classroom.id]
      }
    end

    before do
      allow(user).to receive(:classrooms_i_own_that_a_specific_user_coteaches_with_me) { [classroom] }
      allow(user).to receive(:classroom_ids_i_have_invited_a_specific_teacher_to_coteach) { [classroom.id] }
    end

    it 'should set the classroom, coteachers, and selected teacher and classroom' do
      get :edit_coteacher_form, params: { classrooms_teacher_id: 45 }
      expect(response).to redirect_to(teachers_classrooms_path)
    end
  end

  describe '#update_order' do
    let!(:user) { create(:teacher) }
    let!(:classrooms_teachers) { create_list(:classrooms_teacher, 3, user_id: user.id) }
    let(:updated_order) { [1, 2, 0] }

    let(:updated_classrooms_params) do
      classrooms_teachers.map.with_index do |classrooms_teacher, i|
        { id: classrooms_teacher.classroom_id, order: updated_order[i] }
      end
    end

    it 'should update the order value for classrooms_teachers' do
      put :update_order, params: { updated_classrooms: updated_classrooms_params.to_json }

      classrooms_teachers.each_with_index do |classrooms_teacher, i|
        expect(classrooms_teacher.reload.order).to eq updated_order[i]
      end
    end
  end

  describe '#specific_coteacher_info' do
    let(:classroom) { create(:classroom) }

    before do
      allow_any_instance_of(User).to receive(:classrooms_i_own_that_a_specific_user_coteaches_with_me) { [classroom] }
      allow_any_instance_of(User).to receive(:classroom_ids_i_have_invited_a_specific_teacher_to_coteach) { [classroom.id] }
    end

    it 'should render the correct json' do
      get :specific_coteacher_info, params: { coteacher_id: user.id }, as: :json
      expect(response.body).to eq({
      selectedTeachersClassroomIds: {
          is_coteacher: [classroom.id],
          invited_to_coteach: [classroom.id]
        }
      }.to_json)
    end
  end

  describe '#destroy' do
    let(:classroom) { create(:classroom) }
    let!(:classroom_teacher) { create(:classrooms_teacher, user: user, classroom: classroom) }

    it 'should destroy the given classroom teacher' do
      delete :destroy, params: { classroom_id: classroom.id }
      expect{ ClassroomsTeacher.find(classroom_teacher.id) }.to raise_exception ActiveRecord::RecordNotFound
      expect(response.body).to eq({message: "Deletion Succeeded!"}.to_json)
    end
  end
end
