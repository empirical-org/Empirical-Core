require 'rails_helper'

describe Teachers::ClassroomsController, type: :controller do
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

end
