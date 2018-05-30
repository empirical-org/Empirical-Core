require 'rails_helper'

describe Teachers::ClassroomsController, type: :controller do
  it { should use_before_filter :teacher! }
  it { should use_before_filter :authorize_owner! }
  it { should use_before_filter :authorize_teacher! }

  describe 'creating a classroom' do
    let(:teacher) { create(:teacher) }
    let(:classroom_attributes) {attributes_for(:classroom)}

    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'kicks off a background job' do
      pending 'figure out if this is the way to do test a background job'
      expect {
        post :create, classroom: {name: 'My Class', grade: '8', code: 'whatever-whatever'}
        expect(response.status).to eq(302) # Redirects after success
      }.to change(ClassroomCreationWorker.jobs, :size).by(1)
    end

    it 'responds with a json object representing the classroom' do
        post :create, classroom: classroom_attributes
        returned_class = JSON.parse(response.body)['classroom']
        returned_name_and_grade = [returned_class['name'], returned_class['grade']]
        passed_name_and_grade = [classroom_attributes[:name], classroom_attributes[:grade]]
        expect(returned_name_and_grade).to eq(passed_name_and_grade)
    end

    it 'should render toInviteStudents true when there are no students but the teacher has units' do
      create(:unit, user_id: teacher.id)
      post :create, classroom: classroom_attributes
      expect(JSON.parse(response.body)['toInviteStudents']).to be
    end

    it 'should render toInviteStudents false when there are students in the classroom' do
      classroom = create(:classroom_with_a_couple_students)
      post :create, classroom: classroom.attributes
      expect(JSON.parse(response.body)['toInviteStudents']).not_to be
    end

    it 'should render toInviteStudents false when the teacher has no units' do
      post :create, classroom: classroom_attributes
      expect(JSON.parse(response.body)['toInviteStudents']).not_to be
    end

    it 'displays the form' do
      get :new
      expect(response.status).to eq(200)
    end
  end

  describe 'creating a login pdf' do

    let(:teacher) { create(:teacher) }
    let(:different_classroom) { create(:classroom) }
    let(:different_teacher) { different_classroom.owner }

    before do
      session[:user_id] = teacher.id
    end

    it 'does not allow teacher unauthorized access to other PDFs' do
      get :generate_login_pdf, id: different_classroom.id
      # expected result is a redirect away from the download page
      # because the teacher in question should not be able to access
      # student login information of a class that is not theirs
      expect(response.status).to eq(303)
    end
  end

  describe '#transfer_ownership' do
    let!(:classroom)         { create(:classroom) }
    let!(:owner)             { classroom.owner }
    let!(:valid_coteacher)   { create(:coteacher_classrooms_teacher, classroom: classroom).user }
    let!(:unaffiliated_user) { create(:teacher) }

    it 'does not allow transferring a classroom not owned by current user' do
      session[:user_id] = unaffiliated_user.id
      post :transfer_ownership, id: classroom.id, requested_new_owner_id: valid_coteacher.id
      expect(response.status).to eq(303)
      expect(classroom.owner).to eq(owner)
    end

    it 'does not allow transferring a classroom to a teacher who is not already a coteacher' do
      session[:user_id] = owner.id
      post :transfer_ownership, id: classroom.id, requested_new_owner_id: unaffiliated_user.id
      expect(classroom.owner).to eq(owner)
    end

    it 'transfers ownership to a coteacher' do
      session[:user_id] = owner.id
      post :transfer_ownership, id: classroom.id, requested_new_owner_id: valid_coteacher.id
      expect(classroom.owner).to eq(valid_coteacher)
      expect(classroom.coteachers.length).to eq(1)
      expect(classroom.coteachers.first).to eq(owner)
    end
  end

  describe '#index' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    context 'when current user has no classrooms i teach, archived classrooms and outstanding teacher invitation' do
      before do
        allow(teacher).to receive(:classrooms_i_teach) { [] }
        allow(teacher).to receive(:has_outstanding_coteacher_invitation?) { false }
        allow(teacher).to receive(:archived_classrooms) { [] }
      end

      it 'should redirect to new classroom path' do
        get :index
        expect(response).to redirect_to new_teachers_classroom_path
      end
    end

    context 'when current user has classrooms i teach' do
      let(:classroom) { create(:classroom) }

      before do
        allow(teacher).to receive(:classrooms_i_teach) { [classroom] }
      end

      it 'should assign the classrooms and classroom' do
        get :index
        expect(assigns(:classrooms)).to eq [classroom]
        expect(assigns(:classroom)).to eq classroom
      end
    end
  end

  describe '#classroom_i_teach' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(teacher).to receive(:classrooms_i_teach) { [classroom] }
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should give the classroom i teach for the current user' do
      get :classrooms_i_teach
      expect(assigns(:classrooms)).to eq [classroom]
    end
  end

  describe '#regenerate_code' do
    let(:teacher) { create(:teacher) }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow(Classroom).to receive(:generate_unique_code) { "unique code" }
    end

    it 'should give the new code' do
      get :regenerate_code
      expect(response.body).to eq({code: "unique code"}.to_json)
    end
  end

  describe '#update' do
    let!(:classroom) { create(:classroom) }
    let(:teacher) { classroom.owner }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should update the given classroom' do
      post :update, id: classroom.id, classroom: { name: "new name" }
      expect(classroom.reload.name).to eq "new name"
      expect(response).to redirect_to teachers_classroom_students_path(classroom.id)
    end
  end

  describe '#destroy' do
    let!(:classroom) { create(:classroom) }
    let(:teacher) { classroom.owner }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should destroy the given classroom' do
      delete :destroy, id: classroom.id
      expect{Classroom.find classroom.id}.to raise_exception ActiveRecord::RecordNotFound
      expect(response).to redirect_to teachers_classrooms_path
    end
  end

  describe '#hide' do
    let!(:classroom) { create(:classroom) }
    let(:teacher) { classroom.owner }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should hide the classroom' do
      put :hide, id: classroom.id
      expect(classroom.reload.visible).to eq false
      expect(response).to redirect_to teachers_classrooms_path
    end
  end

  describe '#unhide' do
    let!(:classroom) { create(:classroom) }
    let(:teacher) { classroom.owner }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should unhide the classroom' do
      classroom.update(visible: false)
      post :unhide, class_id: classroom.id
      expect(classroom.reload.visible).to eq true
    end
  end

  describe '#units' do
    let!(:classroom) { create(:classroom) }
    let(:teacher) { classroom.owner }

    before do
      allow(controller).to receive(:current_user) { teacher }
      allow_any_instance_of(Classroom).to receive(:units_json) { "units" }
    end

    it 'should give the correct json' do
      get :units, id: classroom.id
      expect(response.body).to eq({units: "units"}.to_json)
    end
  end
end
