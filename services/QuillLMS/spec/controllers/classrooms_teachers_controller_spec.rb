require 'rails_helper'

describe ClassroomsTeachersController, type: :controller do
  it { should use_before_action :signed_in! }
  it { should use_before_action :multi_classroom_auth }

  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#edit_coteacher_form' do
    let(:classroom) { create(:classroom) }
    let(:edit_info_for_teacher) {
      {
          is_coteacher: [classroom.id],
          invited_to_coteach: [classroom.id]
      }
    }

    before do
     allow(user).to receive(:classrooms_i_own_that_a_specific_user_coteaches_with_me) { [classroom] }
     allow(user).to receive(:classroom_ids_i_have_invited_a_specific_teacher_to_coteach) { [classroom.id] }
    end

    it 'should set the classroom, coteachers, and selected teacher and classroom' do
      get :edit_coteacher_form, params: { classrooms_teacher_id: 45 }
      expect(response).to redirect_to(teachers_classrooms_path)
    end
  end

  # describe '#update_coteachers' do
  #   let(:classrooms) { {negative_classroom_ids: [1,2,3], positive_classroom_ids: [4,5,6]} }
  #
  #   before do
  #     allow_any_instance_of(User).to receive(:handle_negative_classrooms_from_update_coteachers) { true }
  #     allow_any_instance_of(User).to receive(:handle_positive_classrooms_from_update_coteachers) { true }
  #   end
  #
  #   it 'should set the classrooms and update the coteacher with the correct classrooms' do
  #     expect_any_instance_of(User).to receive(:handle_negative_classrooms_from_update_coteachers).with([1,2,3])
  #     expect_any_instance_of(User).to receive(:handle_positive_classrooms_from_update_coteachers).with([4,5,6], user.id)
  #     post :update_coteachers, classrooms: classrooms, classroom_teacher_id: user.id
  #     expect(assigns(:classrooms)).to eq classrooms
  #   end
  # end

  describe '#update_order' do

    before do
      user = create(:user, role: "teacher")
      @classrooms_teacher1 = create(:classrooms_teacher, user_id: user.id)
      @classrooms_teacher2 = create(:classrooms_teacher, user_id: user.id)
      @classrooms_teacher3 = create(:classrooms_teacher, user_id: user.id)
    end

    it 'should update the order value for classrooms_teachers' do
      classrooms_teacher_array = [@classrooms_teacher1, @classrooms_teacher2, @classrooms_teacher3]
      order = [1, 2, 0]
      params_array = [{ id: @classrooms_teacher1.classroom_id, order: 1 }, { id: @classrooms_teacher2.classroom_id, order: 2 }, { id: @classrooms_teacher3.classroom_id, order: 0 }]

      put :update_order, params: { updated_classrooms: params_array.to_json }

      classrooms_teacher_array.each_with_index do |classrooms_teacher, i|
        expect classrooms_teacher.order == order[i]
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
      get :specific_coteacher_info, params: { format: :json, coteacher_id: user.id }
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
