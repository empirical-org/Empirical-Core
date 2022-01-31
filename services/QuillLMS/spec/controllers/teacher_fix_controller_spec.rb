# frozen_string_literal: true

require 'rails_helper'

describe TeacherFixController do
  let(:staff) { create(:staff) }

  before { allow(controller).to receive(:current_user) { staff } }

  it { should use_before_action :staff! }

  describe '#archived_units' do
    context 'when user does not exist' do
      it 'should render no such user' do
        get :archived_units, params: { teacher_identifier: "new@email.com" }
        expect(response.body).to eq({error: "No such user."}.to_json)
      end
    end

    context 'when user is not teacher' do
      let!(:user) { create(:student) }

      it 'should render user is not a teacher' do
        get :archived_units, params: { teacher_identifier: user.email }
        expect(response.body).to eq({error: "This user is not a teacher."}.to_json)
      end
    end

    context 'when user is teacher' do
      let!(:user) { create(:teacher) }

      context 'when archived units are present' do
        let!(:unit) { create(:unit, visible: false, user_id: user.id) }

        it 'should render the archived units' do
          get :archived_units, params: { teacher_identifier: user.email }
          expect(response.body).to eq({archived_units: [unit.attributes.merge({"shared_name" => false})]}.to_json)
        end
      end

      context 'when archived units are not present' do
        it 'should render the user has no archived units' do
          get :archived_units, params: { teacher_identifier: user.email }
          expect(response.body).to eq({error: "This user has no archived units."}.to_json)
        end
      end
    end
  end

  describe '#unarchive_units' do
    let!(:unit) { create(:unit, visible: false) }
    let!(:activity) { create(:classroom_unit, unit_id: unit.id, visible: false) }
    let!(:session) { create(:activity_session, classroom_unit_id: activity.id, visible: false) }
    let!(:unit1) { create(:unit, visible: false) }
    let!(:activity1) { create(:classroom_unit, unit_id: unit1.id, visible: false) }
    let!(:session1) { create(:activity_session, classroom_unit_id: activity.id) }
    let!(:unit2) { create(:unit, visible: false) }
    let!(:activity2) { create(:classroom_unit, unit_id: unit2.id, visible: false) }
    let!(:session2) { create(:activity_session, classroom_unit_id: activity.id) }

    it 'should change the names of given units' do
      post :unarchive_units,
        params: {
          changed_names: [[unit.id, "new name"]],
          unit_ids: [unit.id, unit1.id, unit2.id]
        },
        as: :json

      expect(unit.reload.name).to eq "new name"
    end

    it 'should make all the units visible' do
      post :unarchive_units,
        params: {
          changed_names: [],
          unit_ids: [unit.id, unit1.id, unit2.id]
        },
        as: :json

      expect(unit.reload.visible).to eq true
      expect(unit1.reload.visible).to eq true
      expect(unit2.reload.visible).to eq true
    end

    it 'should mark all the activity sessions visible' do
      post :unarchive_units,
        params: {
          changed_names: [],
          unit_ids: [unit.id, unit1.id, unit2.id]
        },
        as: :json

      expect(activity.reload.visible).to eq true
      expect(activity1.reload.visible).to eq true
      expect(activity2.reload.visible).to eq true
      expect(session.reload.visible).to eq true
      expect(session1.reload.visible).to eq true
      expect(session2.reload.visible).to eq true
    end
  end

  describe '#recover_classroom_units' do
    context 'classroom exists' do
      let!(:classroom) { create(:classroom) }
      let!(:unit) { create(:unit, visible: false) }
      let!(:classroom_unit) { create(:classroom_unit, visible: false,classroom_id: classroom.id, unit_id: unit.id) }

      it 'should mark the units and activit sessions visible' do
        post :recover_classroom_units, params: { class_code: classroom.code }
        expect(unit.reload.visible).to eq true
        expect(classroom_unit.reload.visible).to eq true
      end
    end

    context 'classroom does not exist' do
      it 'should render no such classroom' do
        post :recover_classroom_units, params: { class_code: "some code" }
        expect(response.body).to eq({error: "No such classroom"}.to_json)
      end
    end
  end

  describe '#recover_unit_activities' do
    context 'when user exists and role is teacher' do
      let!(:user) { create(:teacher) }

      let!(:unit) { create(:unit, user_id: user.id, name: "some name") }
      let!(:classroom_unit) { create(:classroom_unit, unit_id: unit.id, visible: true) }
      let!(:unit_activity) { create(:unit_activity, unit_id: unit.id, visible: false) }

      it 'should update all the unit activities' do
        post :recover_unit_activities, params: { email: user.email }
        expect(unit_activity.reload.visible).to eq true
        expect(response.code).to eq "200"
      end
    end
  end

  describe '#recover_activity_sessions' do
    context 'when user exists and role is teacher' do
      let!(:user) { create(:teacher) }

      context 'when unit exists' do
        let!(:another_user) { create(:user) }
        let!(:unit) { create(:unit, user_id: user.id, name: "some name") }
        let!(:classroom_unit) { create(:classroom_unit, unit_id: unit.id, visible: false) }
        let!(:activity_session) { create(:activity_session, visible: false, classroom_unit_id: classroom_unit.id, user_id: another_user.id) }

        it 'should update all the classroom activities' do
          post :recover_activity_sessions, params: { email: user.email, unit_name: "some name" }
          expect(activity_session.reload.visible).to eq true
          expect(classroom_unit.reload.visible).to eq true
          expect(classroom_unit.reload.assigned_student_ids).to eq [another_user.id]
          expect(response.code).to eq "200"
        end
      end

      context 'when unit does not exist' do
        it 'should render the user does not have a unit' do
          post :recover_activity_sessions, params: { email: user.email, unit_name: "test" }
          expect(response.body).to eq({error: "The user with the email #{user.email} does not have a unit named test"}.to_json)
        end
      end
    end

    context 'when user exists but not teacher' do
      let!(:user) { create(:user) }

      it 'should render cannot find teacher' do
        post :recover_activity_sessions, params: { email: user.email }
        expect(response.body).to eq({error: "Cannot find a teacher with the email #{user.email}."}.to_json)
      end
    end

    context 'when user does not exist' do
      it 'should render cannot find teacher' do
        post :recover_activity_sessions, params: { email: "some@email.com" }
        expect(response.body).to eq({error: "Cannot find a teacher with the email some@email.com."}.to_json)
      end
    end
  end

  describe '#merge_student_accounts' do
    context 'when both the accounts exist' do
      context 'when both the accounts are students' do
        context 'when both students are from the same classroom' do
          let!(:classroom) { create(:classroom) }
          let!(:student) { create(:student, classrooms: [classroom]) }
          let!(:student1) { create(:student, classrooms: [classroom]) }

          it 'should return a 200' do
            post :merge_student_accounts, params: { account1_identifier: student.email, account2_identifier: student1.email }
            expect(response.status).to eq(200)
          end
        end

        context 'when both students are not from the same classroom' do
          let!(:classroom) { create(:classroom) }
          let!(:classroom2) { create(:classroom) }
          let!(:student) { create(:student, classrooms: [classroom] ) }
          let!(:student1) { create(:student, classrooms: [classroom2] ) }

          it 'should return that students are not in the same classroom' do
            post :merge_student_accounts, params: { account1_identifier: student.email, account2_identifier: student1.email }
            expect(response.body).to eq({error: "#{student1.email} is in at least one class that #{student.email} is not in, so we can't merge them."}.to_json)
          end
        end
      end

      context 'when both the accounts are not students' do
        let!(:student) { create(:student) }
        let!(:user) { create(:user) }

        it 'should render that student is not a student' do
          post :merge_student_accounts, params: { account1_identifier: student.email, account2_identifier: user.email }
          expect(response.body).to eq({error: "#{user.email} is not a student."}.to_json)
        end
      end
    end

    context 'when both the accounts do not exist' do
      let!(:student) { create(:student) }

      it 'should render that we do not have an account for the user' do
        post :merge_student_accounts, params: { account1_identifier: student.email, account2_identifier: "test@email.com" }
        expect(response.body).to eq({error: "We do not have an account for test@email.com"}.to_json)

      end
    end
  end

  describe '#merge_teacher_accounts' do
    context 'when both the account exist' do
      context 'when both the accounts are teachers' do
        let!(:teacher) { create(:teacher) }
        let!(:teacher1) { create(:teacher) }
        let!(:unit) { create(:unit, user_id: teacher.id) }
        let!(:classrooms_teacher) { create(:classrooms_teacher, user_id: teacher.id) }

        it 'should update the classrooms teacher and unit' do
          post :merge_teacher_accounts, params: { account1_identifier: teacher.email, account2_identifier: teacher1.email }
          expect(unit.reload.user_id).to eq teacher1.id
          expect(classrooms_teacher.reload.user_id).to eq teacher1.id
        end
      end

      context 'when both the accounts are not teachers' do
        let!(:teacher) { create(:teacher) }
        let!(:user) { create(:user) }

        it 'should render that user is not a teacher' do
          post :merge_teacher_accounts, params: { account1_identifier: teacher.email, account2_identifier: user.email }
          expect(response.body).to eq({error: "#{user.email} is not a teacher."}.to_json)
        end
      end
    end

    context 'when both the accounts dont exist' do
      let!(:teacher) { create(:teacher) }

      it 'should render that user does not exist' do
        post :merge_teacher_accounts, params: { account1_identifier: teacher.email, account2_identifier: "test@email.com" }
        expect(response.body).to eq( {error: "We do not have an account for test@email.com"}.to_json)
      end
    end
  end

  describe '#move_student_from_one_class_to_another' do
    context 'when user exists' do
      context 'when user is a student' do
        let!(:user) { create(:student) }

        context 'when both classrooms exists' do
          let!(:classroom) { create(:classroom) }
          let!(:classroom1) { create(:classroom) }

          context 'when students classrooms exist' do
            let!(:students_classroom) { create(:students_classrooms, student_id: user.id, classroom_id: classroom.id) }
            let!(:students_classroom1) { create(:students_classrooms, student_id: user.id, classroom_id: classroom1.id, visible: false) }

            it 'should update the students classrooms, move the activity session and destroy the students classrooms' do
              # expect(user).to receive(:move_activity_sessions).with(classroom, classroom1)
              post :move_student_from_one_class_to_another, params: { class_code1: classroom.code, class_code2: classroom1.code, student_identifier: user.email }
              expect(students_classroom1.reload.visible).to eq true
              expect(StudentsClassrooms.unscoped.find(students_classroom.id).visible).not_to be
            end
          end

          context 'when students classrooms does not exist' do
            it 'should render student is not in any classrooms' do
              post :move_student_from_one_class_to_another, params: { class_code1: classroom.code, class_code2: classroom1.code, student_identifier: user.email }
              expect(response.body).to eq({error: "#{user.email} is not in a classroom with the code #{classroom.code}."}.to_json)
            end
          end
        end

        context 'when both classrooms dont exist' do
          let!(:classroom) { create(:classroom) }

          it 'should render that classroom could not be found' do
            post :move_student_from_one_class_to_another, params: { class_code1: classroom.code, class_code2: "some_code", student_identifier: user.email }
            expect(response.body).to eq({error: "We cannot find a class with class code some_code."}.to_json)
          end
        end
      end

      context 'when user is not a student' do
        let!(:user) { create(:user) }

        it 'should render user is not a student' do
          post :move_student_from_one_class_to_another, params: { student_identifier: user.email }
          expect(response.body).to eq({error: "#{user.email} is not a student."}.to_json)
        end
      end
    end

    context 'when user does not exist' do
      it 'should render account does not exist' do
        post :move_student_from_one_class_to_another, params: { student_identifier: "non@user.com" }
        expect(response.body).to eq({error: "We do not have an account for non@user.com"}.to_json)
      end
    end
  end

  describe '#google_unsync_account' do
    context 'when user exists' do
      context 'when new email is not given' do
        let!(:user) { create(:student, :signed_up_with_google) }

        it 'should reset the google id and set the signed up with google flag' do
          post :google_unsync_account, params: { original_email: user.email, password: "test123" }
          expect(user.reload.signed_up_with_google).to eq false
          expect(user.reload.google_id).to eq nil
        end
      end

      context 'when new email is given' do
        let!(:user) { create(:student, :signed_up_with_google) }

        it 'should update the email, reset the google id and set the signed up with google flag' do
          post :google_unsync_account, params: { original_email: user.email, password: "test123", new_email: "new@email.com" }
          expect(user.reload.email).to eq "new@email.com"
          expect(user.reload.signed_up_with_google).to eq false
          expect(user.reload.google_id).to eq nil
        end
      end
    end

    context 'when user does not exist' do
      it 'should render user does not exist' do
        post :google_unsync_account, params: { original_email: "some@email.com" }
        expect(response.body).to eq({error: "We do not have a user registered with the email some@email.com"}.to_json)
      end
    end
  end

  describe '#merge_two_schools' do
    context 'when to school id given' do
      it 'should not merge the schools' do
        expect(TeacherFixes).to_not receive(:merge_two_schools)
        post :merge_two_schools, params: { to_school_id: "to_id" }
        expect(response.body).to eq({error: "Please specify a school ID."}.to_json)
      end
    end

    context 'when from school id given' do
      it 'should not merge the schools' do
        expect(TeacherFixes).to_not receive(:merge_two_schools)
        post :merge_two_schools, params: { from_school_id: "from_id" }
        expect(response.body).to eq({error: "Please specify a school ID."}.to_json)
      end
    end

    context 'when both school ids given' do
      it 'should merge the two schools' do
        expect(TeacherFixes).to receive(:merge_two_schools).with("from_id", "to_id")
        post :merge_two_schools, params: { to_school_id: "to_id", from_school_id: "from_id" }
      end
    end
  end

  describe '#merge_activity_packs' do
    let!(:user) {create(:user)}
    let!(:classroom) {create(:classroom)}
    let!(:unit1) {create(:unit, user: user, classrooms: [classroom])}
    let!(:unit2) {create(:unit, user: user, classrooms: [classroom])}

    context 'when one or more unit IDs are missing' do
      it 'should not merge activity packs' do
        expect(TeacherFixes).to_not receive(:merge_two_units)
        post :merge_activity_packs, params: { from_activity_pack_id: unit1.id }
        expect(response.body).to eq({error: "Please specify an activity pack ID."}.to_json)
      end
    end

    context 'when one or more unit IDs are invalid' do
      it 'should not merge activity packs' do
        expect(TeacherFixes).to_not receive(:merge_two_units)
        post :merge_activity_packs, params: { from_activity_pack_id: unit1.id, to_activity_pack_id: 1000000000000 }
        expect(response.body).to eq({error: "The second activity pack ID is invalid."}.to_json)
      end
    end

    context 'when the activity packs have different users' do
      it 'should not merge activity packs' do
        another_user = create(:user)
        unit3 = create(:unit, user: another_user)
        expect(TeacherFixes).to_not receive(:merge_two_units)
        post :merge_activity_packs, params: { from_activity_pack_id: unit1.id, to_activity_pack_id: unit3.id }
        expect(response.body).to eq({error: "The two activity packs must belong to the same teacher."}.to_json)
      end
    end

    context 'when the activity packs have different classrooms' do
      it 'should not merge activity packs' do
        another_classroom = create(:classroom)
        unit3 = create(:unit, user: user, classrooms: [another_classroom])
        expect(TeacherFixes).to_not receive(:merge_two_units)
        post :merge_activity_packs, params: { from_activity_pack_id: unit1.id, to_activity_pack_id: unit3.id }
        expect(response.body).to eq({error: "The two activity packs must be assigned to the same classroom."}.to_json)
      end
    end

    context 'when both activity packs are valid' do
      it 'should merge the activity packs' do
        expect(TeacherFixes).to receive(:merge_two_units).with(unit1, unit2)
        post :merge_activity_packs, params: { from_activity_pack_id: unit1.id, to_activity_pack_id: unit2.id }
      end
    end
  end

  describe '#merge_two_classrooms' do
    context 'when first classrooms exists' do
      let!(:classroom) { create(:classroom) }

      it 'should not merge the classrooms' do
        expect(TeacherFixes).to_not receive(:merge_two_classrooms)
        post :merge_two_classrooms, params: { class_code1: classroom.code, class_code2: "some_code" }
        expect(response.body).to eq({error: "The second class code is invalid"}.to_json)
      end
    end

    context 'when second classroom exists' do
      let!(:classroom) { create(:classroom) }

      it 'should not merge the classrooms' do
        expect(TeacherFixes).to_not receive(:merge_two_classrooms)
        post :merge_two_classrooms, params: { class_code2: classroom.code, class_code1: "some_code" }
        expect(response.body).to eq({error: "The first class code is invalid"}.to_json)
      end
    end

    context 'when both classrooms exist' do
      let!(:classroom) { create(:classroom) }
      let!(:classroom1) { create(:classroom) }

      it 'should merge the two classrooms' do
        expect(TeacherFixes).to receive(:merge_two_classrooms).with(classroom.id, classroom1.id)
        post :merge_two_classrooms, params: { class_code2: classroom1.code, class_code1: classroom.code }
        expect(response.code).to eq "200"
      end
    end
  end

  describe '#delete_last_activity_session' do
    context 'when user does not exist' do
      let!(:activity) { create(:activity) }

      it 'should render no such student' do
        post :delete_last_activity_session, params: { student_identifier: "some@email.com", activity_name: activity.name }
        expect(response.body).to eq({error: "No such student"}.to_json)
      end
    end

    context 'when activity does not exist' do
      let!(:user) { create(:user) }

      it 'should render no such activity' do
        post :delete_last_activity_session, params: { student_identifier: user.email, activity_name: "some_name" }
        expect(response.body).to eq({error: "No such activity"}.to_json)
      end
    end

    context 'when user and activity exist' do
      let!(:user) { create(:user) }
      let!(:activity) { create(:activity) }

      it 'should delete the last activity session' do
        expect(TeacherFixes).to receive(:delete_last_activity_session).with(user.id, activity.id)
        post :delete_last_activity_session, params: { student_identifier: user.email, activity_name: activity.name }
        expect(response.code).to eq "200"
      end
    end
  end

  describe '#list_unsynced_students_by_classroom' do
    let(:teacher) { create(:teacher) }

    context 'with a teacher identifier that does not exist' do
      it 'should return an error' do
        get :list_unsynced_students_by_classroom, params: { teacher_identifier: 'not-a-legit-teacher-indentifier' }
        expect(response.code).to eq '404'
      end
    end

    context 'with a teacher identifier that does exist' do
      it 'should return successfully' do
        get :list_unsynced_students_by_classroom, params: { teacher_identifier: teacher.email }
        expect(response.code).to eq '200'
      end
    end
  end

  describe '#remove_unsynced_students' do
    let(:teacher) { create(:teacher) }

    context 'with a teacher identifier that does not exist' do
      it 'should return an error' do
        post :remove_unsynced_students, params: { teacher_identifier: 'not-a-legit-teacher-indentifier' }
        expect(response.code).to eq '404'
      end
    end

    context 'with a teacher identifier that does exist' do
      it 'should return successfully' do
        post :remove_unsynced_students, params: { teacher_identifier: teacher.email }
        expect(response.code).to eq '200'
      end

      context 'with an unsynced student' do
        let(:classroom) { create(:google_classroom_with_a_couple_google_students, :with_no_teacher) }
        let(:unsynced_student) { classroom.students.second }
        let(:synced_student) { classroom.students.first }

        before do
          create(:classrooms_teacher, user: teacher, classroom: classroom)

          create(
            :google_classroom_user,
            provider_user_id: synced_student.google_id,
            provider_classroom_id: classroom.google_classroom_id
          )

          create(
            :google_classroom_user,
            :deleted,
            provider_user_id: unsynced_student.google_id,
            provider_classroom_id: classroom.google_classroom_id
          )
        end

        it 'should remove the unsynced student' do
          expect {
            post :remove_unsynced_students, params: { teacher_identifier: teacher.email }
          }.to change(StudentsClassrooms, :count).from(2).to(1)
        end
      end
    end
  end
end
