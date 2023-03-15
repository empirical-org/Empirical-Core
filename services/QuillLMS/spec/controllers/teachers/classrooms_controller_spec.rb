# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ClassroomsController, type: :controller do
  it { should use_before_action :teacher! }
  it { should use_before_action :authorize_owner! }
  it { should use_before_action :authorize_teacher! }

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

  describe 'remove students' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }
    let!(:classrooms_teacher) do
      create(:classrooms_teacher, user_id: teacher.id, classroom: classroom)
    end
    let(:students_classroom) { create(:students_classrooms, classroom: classroom)}

    before do
      session[:user_id] = teacher.id
    end

    it 'archives the students_classrooms record and calls the ArchiveStudentAssociationsForClassroomWorker' do
      expect(ArchiveStudentAssociationsForClassroomWorker).to receive(:perform_async).with(students_classroom.student_id, classroom.id)
      post :remove_students,
        params: {
          classroom_id: classroom.id,
          student_ids: [students_classroom.student_id],
        },
        as: :json
      students_classroom.reload
      expect(students_classroom.visible).to be(false)
    end

  end

  describe 'create students' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }
    let!(:classrooms_teacher) do
      create(:classrooms_teacher, user_id: teacher.id, classroom: classroom)
    end

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
      post :create_students,
        params: {
          classroom_id: classroom.id,
          students: [student1, student2],
          classroom: {}
        },
        as: :json
    end

    it 'student creator catches duplicate usernames' do
      student1 = { name: 'Good Kid', password: 'Kid', username: "good.kid@#{classroom.code}"}
      student2 = { name: 'Good Kid', password: 'Kid', username: "good.kid@#{classroom.code}"}
      student1_with_account_type = student1.dup
      student1_with_account_type[:account_type] = 'Teacher Created Account'
      student2_with_account_type = student2.dup
      student2_with_account_type[:account_type] = 'Teacher Created Account'

      post :create_students,
        params: {
          classroom_id: classroom.id,
          students: [student1, student2],
          classroom: {}
        },
        as: :json

      expect(User.find_by_username_or_email("good.kid@#{classroom.code}")).to be
      expect(User.find_by_username_or_email("good.kid1@#{classroom.code}")).to be
    end

    context 'current_user is not the classroom owner' do
      it 'should not allow a teacher to modify a classroom' do
        unauthorized_teacher = create(:teacher)
        unauthorized_student = { name: 'Fake Kid', password: 'Kid', username: "fake.kid@aol.com"}
        allow(controller).to receive(:current_user) { unauthorized_teacher }
        post :create_students, params: { classroom_id: classroom.id, students: [unauthorized_student], classroom: {} }

        expect(response).to redirect_to(new_session_path)
        expect(User.find_by(name: 'Fake Kid')).to be nil
      end
    end
  end

  describe 'creating a login pdf' do
    let(:teacher) { create(:teacher) }
    let(:different_classroom) { create(:classroom) }
    let(:different_teacher) { different_classroom.owner }

    before { session[:user_id] = teacher.id }

    it 'does not allow teacher unauthorized access to other PDFs' do
      get :generate_login_pdf, params: { id: different_classroom.id, format: :pdf, only: [:pdf] }

      expect(response.status).to eq(303)
    end
  end

  describe '#transfer_ownership' do
    let!(:current_owner) { create(:teacher, name: 'joe smith') }
    let!(:subsequent_owner) { create(:teacher, name: 'betty jones') }
    let!(:classroom) { Classroom.create(name: 'a_class') }
    # Why not use a factory above? Because the classroom factory has a callback that creates
    # associations which break these specs
    let!(:classrooms_teacher) do
      create(:classrooms_teacher,
              user_id: current_owner.id,
              classroom: classroom,
              role: ClassroomsTeacher::ROLE_TYPES[:owner])
      create(:classrooms_teacher,
              user_id: subsequent_owner.id,
              classroom: classroom,
              role: ClassroomsTeacher::ROLE_TYPES[:coteacher])
    end

    let!(:unaffiliated_user) { create(:teacher) }

    it 'does not allow transferring a classroom not owned by current user' do
      session[:user_id] = unaffiliated_user.id
      post :transfer_ownership, params: { id: classroom.id, requested_new_owner_id: subsequent_owner.id }
      expect(response.status).to eq(303)
      expect(classroom.owner).to eq(current_owner)
    end

    it 'does not allow transferring a classroom to a teacher who is not already a coteacher' do
      session[:user_id] = current_owner.id
      post :transfer_ownership, params: { id: classroom.id, requested_new_owner_id: unaffiliated_user.id }
      expect(classroom.owner).to eq(current_owner)
    end

    it 'transfers ownership to a coteacher' do
      session[:user_id] = current_owner.id
      post :transfer_ownership, params: { id: classroom.id, requested_new_owner_id: subsequent_owner.id }

      expect(classroom.owner).to eq(subsequent_owner)
      expect(classroom.coteachers.length).to eq(1)
      expect(classroom.coteachers.first).to eq(current_owner)
    end

    context 'segment IO tracking' do
      let(:analyzer) { double(:analyzer, track_with_attributes: true) }

      before do
        allow(Analyzer).to receive(:new) { analyzer }
      end

      it 'should track the ownership transfer' do
        expect(analyzer).to receive(:track_with_attributes).with(
          current_owner,
          SegmentIo::BackgroundEvents::TRANSFER_OWNERSHIP,
          { properties: { new_owner_id: subsequent_owner.id.to_s } }
        )
        session[:user_id] = current_owner.id
        post :transfer_ownership, params: { id: classroom.id, requested_new_owner_id: subsequent_owner.id }
      end
    end
  end

  describe '#index' do
    let!(:teacher) { create(:teacher) }

    before { allow(controller).to receive(:current_user) { teacher } }

    context 'plain classrooms' do
      let!(:classroom1) { create(:classroom)}
      let!(:classroom2) { create(:classroom)}
      let!(:classroom3) { create(:classroom)}
      let!(:classrooms) { Classroom.where(id: [classroom1.id, classroom2.id, classroom3.id]) }
      let!(:classrooms_teacher1) { create(:classrooms_teacher, classroom: classroom1, user: teacher )}
      let!(:classrooms_teacher2) { create(:classrooms_teacher, classroom: classroom2, user: teacher )}
      let!(:classrooms_teacher3) { create(:classrooms_teacher, classroom: classroom3, user: teacher )}

      before { allow(controller).to receive(:current_user) { teacher } }

      context 'when current user has classrooms i teach' do

        it 'should return classrooms in order of creation date' do
          get :index, as: :json

          parsed_response = JSON.parse(response.body)

          classrooms.order(created_at: :desc).each.with_index do |classroom, i|
            expect(parsed_response["classrooms"][i]["id"]).to eq classroom.id
          end
        end

        it 'should assign the classrooms and classroom and no students' do
          get :index

          classrooms.count.times { |i| expect(assigns(:classrooms)[i][:students]).to be_empty }
        end

        context "with activity sesions" do
          let!(:classroom) { classroom3 }
          let!(:activity) { create(:activity) }
          let!(:student) { create(:user, classcode: classroom.code) }
          let!(:cu) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id])}
          let!(:ua) { create(:unit_activity, unit: cu.unit, activity: activity)}
          let!(:activity_session) { create(:activity_session, user: student, activity: activity, classroom_unit: cu, state: 'finished') }

          it 'should assign students and number_of_completed_activities' do
            get :index

            classrooms.count.times do |i|
              next unless assigns(:classrooms)[i]['id'] == classroom.id

              expect(assigns(:classrooms)[i][:students][0][:number_of_completed_activities]).to eq 1
            end
          end
        end

        context "with order property" do
          before do
            # remove classroom_teacher entries from earlier tests
            ClassroomsTeacher
              .where.not(id: [classrooms_teacher1.id, classrooms_teacher2.id, classrooms_teacher3.id])
              .destroy_all
          end

          it 'should return classrooms in order of order with a fallback to creation date if only some classrooms_teacher entries have order property' do
            ClassroomsTeacher.where(classroom_id: classroom3.id).first.update!(order: 0)

            get :index, as: :json

            parsed_response = JSON.parse(response.body)

            classrooms.joins(:classrooms_teachers).order('classrooms_teachers.order ASC, created_at DESC').each_with_index do |classroom, i|
              expect(parsed_response["classrooms"][i]["id"]).to eq classroom.id
            end
          end

          it 'should return classrooms ordered by order property if all classrooms_teacher entries have order property' do
            ClassroomsTeacher.where(classroom_id: classroom1.id).first.update!(order: 1)
            ClassroomsTeacher.where(classroom_id: classroom2.id).first.update!(order: 0)
            ClassroomsTeacher.where(classroom_id: classroom3.id).first.update!(order: 2)

            get :index, as: :json

            parsed_response = JSON.parse(response.body)

            expect(parsed_response["classrooms"][0]["id"]).to eq classroom2.id
            expect(parsed_response["classrooms"][1]["id"]).to eq classroom1.id
            expect(parsed_response["classrooms"][2]["id"]).to eq classroom3.id
          end
        end
      end
    end

    context 'provider-based classrooms' do
      context 'google classroom' do
        let(:classroom) { create(:classroom_with_a_couple_students, :from_google, students: [student1, student2]) }
        let(:student1) { create(:student, :signed_up_with_google) }
        let(:student2) { create(:student, :signed_up_with_google) }
        let!(:classrooms_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher )}

        before do
          create(:google_classroom_user,
            :active,
            provider_classroom_id: classroom.google_classroom_id,
            provider_user_id: student1.google_id
          )

          create(:google_classroom_user,
            :deleted,
            provider_classroom_id: classroom.google_classroom_id,
            provider_user_id: student2.google_id
          )
        end

        it 'reports which students are no longer in provider classroom' do
          get :index, as: :json
          parsed_response = JSON.parse(response.body)
          expect(parsed_response["classrooms"][0]["students"][0]["synced"]).to eq true
          expect(parsed_response["classrooms"][0]["students"][1]["synced"]).to eq false
        end
      end
    end
  end

  describe '#classroom_i_teach' do
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }

    before do
      allow(teacher).to receive(:classrooms_i_teach).once.and_return([classroom])
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should give the classroom i teach for the current user' do
      get :classrooms_i_teach
      expect(assigns(:classrooms)).to eq [classroom]
    end

    it 'should provide valid data when making fresh and cached queries' do

      2.times do
        get :classrooms_i_teach
        expect(response.status).to eq(200)
        classrooms_payload = JSON.parse(response.body)['classrooms']
        expect(classrooms_payload.length).to eq(1)
        expect(classrooms_payload[0]['id']).to eq(classroom.id)
      end
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
    let(:teacher) { create(:teacher) }
    let(:classroom) { create(:classroom) }
    let!(:classrooms_teacher) do
      create(:classrooms_teacher, user_id: teacher.id, classroom: classroom)
    end

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should update the given classroom' do
      post :update, params: { id: classroom.id, classroom: { name: "new name" } }
      expect(classroom.reload.name).to eq "new name"
      expect(response).to redirect_to teachers_classroom_students_path(classroom.id)
    end
  end

  describe '#hide' do
    let!(:classroom) { create(:classroom) }
    let(:teacher) { classroom.owner }

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should hide the classroom' do
      put :hide, params: { id: classroom.id }
      expect(classroom.reload.visible).to eq false
      expect(response).to redirect_to teachers_classrooms_path
    end
  end

  describe '#bulk_archive' do
    let!(:teacher) { create(:teacher) }
    let!(:owned_classroom1) { create(:classroom, :with_no_teacher) }
    let!(:owned_classroom2) { create(:classroom, :with_no_teacher) }
    let!(:unowned_classroom) { create(:classroom) }
    let!(:classrooms_teacher1) { create(:classrooms_teacher, classroom: owned_classroom1, user: teacher, role: 'owner')}
    let!(:classrooms_teacher2) { create(:classrooms_teacher, classroom: owned_classroom2, user: teacher, role: 'owner')}

    before do
      allow(controller).to receive(:current_user) { teacher }
    end

    it 'should hide the classrooms that are owned by the teacher and not hide the one that is not' do
      put :bulk_archive, params: { ids: [owned_classroom1.id, owned_classroom2.id, unowned_classroom.id] }
      expect(owned_classroom1.reload.visible).to eq false
      expect(owned_classroom2.reload.visible).to eq false
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
      post :unhide, params: { class_id: classroom.id }
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
      get :units, params: { id: classroom.id }
      expect(response.body).to eq({units: "units"}.to_json)
    end
  end
end
