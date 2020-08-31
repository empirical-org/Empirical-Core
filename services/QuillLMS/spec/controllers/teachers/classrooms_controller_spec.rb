require 'rails_helper'

describe Teachers::ClassroomsController, type: :controller do
  it { should use_before_filter :teacher! }
  it { should use_before_filter :authorize_owner! }
  it { should use_before_filter :authorize_teacher! }

  describe 'new' do
    let(:teacher) { create(:teacher) }
    let(:classroom_attributes) {attributes_for(:classroom)}

    before do
      session[:user_id] = teacher.id # sign in, is there a better way to do this in test?
    end

    it 'redirects to the teachers_classrooms_path' do
      get :new
      expect(response).to redirect_to(teachers_classrooms_path(modal: 'create-a-class'))
    end
  end

  describe 'create students' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      session[:user_id] = teacher.id
    end

    it 'calls the student creator' do
      student1 = { name: 'Happy Kid', password: 'Kid', username: "happy.kid@#{classroom.code}"}
      student2 = { name: 'Sad Kid', password: 'Kid', username: "sad.kid@#{classroom.code}"}
      student1_with_account_type = student1.dup
      student1_with_account_type[:account_type] = 'Teacher Created Account'
      student2_with_account_type = student2.dup
      student2_with_account_type[:account_type] = 'Teacher Created Account'
      expect(Creators::StudentCreator).to receive(:create_student).with(student1_with_account_type, classroom.id)
      expect(Creators::StudentCreator).to receive(:create_student).with(student2_with_account_type, classroom.id)
      post :create_students, classroom_id: classroom.id, students: [student1, student2], classroom: {}
    end

    it 'student creator catches duplicate usernames' do
      student1 = { name: 'Good Kid', password: 'Kid', username: "good.kid@#{classroom.code}"}
      student2 = { name: 'Good Kid', password: 'Kid', username: "good.kid@#{classroom.code}"}
      student1_with_account_type = student1.dup
      student1_with_account_type[:account_type] = 'Teacher Created Account'
      student2_with_account_type = student2.dup
      student2_with_account_type[:account_type] = 'Teacher Created Account'
      post :create_students, classroom_id: classroom.id, students: [student1, student2], classroom: {}
      expect(User.find_by_username_or_email("good.kid@#{classroom.code}")).to be
      expect(User.find_by_username_or_email("good.kid1@#{classroom.code}")).to be
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

    context 'segment IO tracking' do
      let(:analyzer) { double(:analyzer, track_with_attributes: true) }

      before do
        allow(Analyzer).to receive(:new) { analyzer }
      end

      it 'should track the ownership transfer' do
        expect(analyzer).to receive(:track_with_attributes).with(
          owner,
          SegmentIo::BackgroundEvents::TRANSFER_OWNERSHIP,
          { properties: { new_owner_id: valid_coteacher.id.to_s } }
        )
        session[:user_id] = owner.id
        post :transfer_ownership, id: classroom.id, requested_new_owner_id: valid_coteacher.id
      end
    end
  end

  describe '#index' do
    let!(:teacher) { create(:teacher) }
    let!(:classroom) { create(:classroom)}
    let!(:classrooms_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher )}

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    context 'when current user has classrooms i teach' do

      it 'should assign the classrooms and classroom and no students' do
        get :index
        expect(assigns(:classrooms)[0]['id']).to eq classroom.id
        expect(assigns(:classrooms)[0][:students]).to be_empty
      end

      context "with activity sesions" do
        let!(:activity) { create(:activity) }
        let!(:student) { create(:user, classcode: classroom.code) }
        let!(:cu) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id])}
        let!(:ua) { create(:unit_activity, unit: cu.unit, activity: activity)}
        let!(:activity_session) { create(:activity_session, user: student, activity: activity, classroom_unit: cu, state: 'finished') }

        it 'should assign students and number_of_completed_activities' do
          get :index
          expect(assigns(:classrooms)[0]['id']).to eq classroom.id
          expect(assigns(:classrooms)[0][:students][0][:number_of_completed_activities]).to eq 1
        end
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

  describe '#bulk_archive' do
    let!(:teacher) { create(:teacher) }
    let!(:owned_classroom_1) { create(:classroom, :with_no_teacher) }
    let!(:owned_classroom_2) { create(:classroom, :with_no_teacher) }
    let!(:unowned_classroom) { create(:classroom) }
    let!(:classrooms_teacher_1) { create(:classrooms_teacher, classroom: owned_classroom_1, user: teacher, role: 'owner')}
    let!(:classrooms_teacher_2) { create(:classrooms_teacher, classroom: owned_classroom_2, user: teacher, role: 'owner')}

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should hide the classrooms that are owned by the teacher and not hide the one that is not' do
      put :bulk_archive, ids: [owned_classroom_1.id, owned_classroom_2.id, unowned_classroom.id]
      expect(owned_classroom_1.reload.visible).to eq false
      expect(owned_classroom_2.reload.visible).to eq false
      expect(unowned_classroom.reload.visible).to eq true
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
