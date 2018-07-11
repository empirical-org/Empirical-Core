require 'rails_helper'

describe ClassroomActivity, type: :model, redis: :true do

  it { should belong_to(:classroom) }
  it { should belong_to(:activity) }
  it { should belong_to(:unit).touch(true) }
  it { should have_one(:topic).through(:activity) }
  it { should have_many(:activity_sessions) }

  it { is_expected.to callback(:check_pinned).before(:validation) }
  it { is_expected.to callback(:check_for_assign_on_join_and_update_students_array_if_true).before(:save) }
  it { is_expected.to callback(:lock_if_lesson).after(:create) }
  it { is_expected.to callback(:teacher_checkbox).after(:save) }
  it { is_expected.to callback(:hide_appropriate_activity_sessions).after(:save) }
  it { is_expected.to callback(:update_lessons_cache).after(:save) }

  let!(:activity_classification_3) { create(:activity_classification, id: 3)}
  let!(:activity_classification_2) { create(:grammar)}
  let!(:activity_classification_6) { create(:lesson)}
  let!(:activity) { create(:activity) }
  let!(:student) { create(:user, role: 'student', username: 'great', name: 'hi hi', password: 'pwd') }
  let!(:classroom) { create(:classroom, students: [student]) }
  let!(:classroom_2) { create(:classroom) }
  let!(:teacher) {classroom.owner}
  let!(:unit) { create(:unit) }
  let!(:classroom_activity) { ClassroomActivity.create(activity: activity, classroom: classroom, unit: unit) }
  let!(:activity_session) {create(:activity_session, classroom_activity_id: classroom_activity.id, activity_id: classroom_activity.activity_id, user_id: student.id, state: 'unstarted')}
  let(:lessons_activity) { create(:activity, activity_classification_id: 6) }
  let(:lessons_classroom_activity) { ClassroomActivity.create(activity: lessons_activity, classroom: classroom, unit: unit) }
  let(:lessons_classroom_activity_2) { ClassroomActivity.create(activity: lessons_activity, classroom: classroom_2, unit: unit) }
  let!(:classroom_activity_with_started_activity_session) { ClassroomActivity.create(activity: activity, classroom: classroom, assigned_student_ids: [student.id]) }
  let!(:started_activity_session) { create(:activity_session, user_id: student.id, classroom_activity_id: classroom_activity_with_started_activity_session.id, activity_id: classroom_activity_with_started_activity_session.activity_id, state: 'started', started_at: Time.now)}
  let!(:classroom_activity_with_no_activity_session) { ClassroomActivity.create(activity: activity, classroom: classroom, assigned_student_ids: [student.id]) }

  describe '#assigned_students' do
    it 'must be empty if none assigned' do
      expect(classroom_activity.assigned_students).to be_empty
    end

    context 'when there is an assigned student' do
      let(:classroom) { Classroom.new(code: '101') }
        before do
          @student = classroom.students.build(first_name: 'John', last_name: 'Doe')
          @student.generate_student(classroom.id)
          @student.save!
        end

        it 'must return a list with one element' do
          classroom_activity = build(:classroom_activity, assigned_student_ids: [@student.id])
          expect(classroom_activity.assigned_students.first).to eq(@student)
        end
    end
  end

  describe '#assign_follow_up_lesson' do
    context 'when follow_up_activity_id in activity is absent' do
      let(:activity) { create(:activity, follow_up_activity: nil) }
      let(:classroom_activity) { create(:classroom_activity, activity: activity) }

      it 'should return false' do
        expect(classroom_activity.assign_follow_up_lesson).to eq(false)
      end
    end

    context 'when classroom activity does not exist' do
      let(:classroom) { create(:classroom) }
      let(:follow_up_activity) { create(:activity) }
      let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }
      let(:classroom_activity) { build(:classroom_activity, activity: activity, classroom: classroom) }

      it 'should create the classroom activity' do
        created_activity = classroom_activity.assign_follow_up_lesson
        expect(created_activity.classroom_id).to eq(classroom_activity.classroom_id)
        expect(created_activity.activity_id).to eq(classroom_activity.activity.follow_up_activity_id)
        expect(created_activity.unit_id).to eq(classroom_activity.unit_id)
        expect(created_activity.visible).to eq(true)
        expect(created_activity.locked).to eq(true)
        expect(created_activity.assign_on_join).to eq(classroom_activity.assign_on_join)
        expect(created_activity.assigned_student_ids).to eq(classroom_activity.assigned_student_ids)
      end
    end
  end

  describe '#is_valid_for_google_announcement_with_specific_user?' do
    it "returns true if the classroom_activity's classroom has a google_classroom_id and the passed user has a google_id" do
      classroom_activity.classroom.update(google_classroom_id: '3')
      teacher.update(google_id: 10)
      expect(classroom_activity.reload.is_valid_for_google_announcement_with_specific_user?(teacher)).to be
    end
    it "returns false if the classroom_activity's classroom does not a google_classroom_id and the passed user has a google_id" do
      classroom_activity.classroom.update(google_classroom_id: nil)
      teacher.update(google_id: 10)
      expect(classroom_activity.reload.is_valid_for_google_announcement_with_specific_user?(teacher)).not_to be
    end
    it "returns false if the classroom_activity's classroom has a google_classroom_id and the user does not have a google_id" do
      classroom_activity.classroom.update(google_classroom_id: 4)
      teacher.update(google_id: nil)
      expect(classroom_activity.reload.is_valid_for_google_announcement_with_specific_user?(teacher)).not_to be
    end
    it "returns false if the classroom_activity's classroom does not have a google_classroom_id and the user does not have a google_id" do
      classroom_activity.classroom.update(google_classroom_id: nil)
      teacher.update(google_id: nil)
      expect(classroom_activity.reload.is_valid_for_google_announcement_with_specific_user?(teacher)).not_to be
    end
  end

  describe '#generate_activity_url' do
    it 'returns a url including the default url' do
      ENV["DEFAULT_URL"] = 'http://cooolsville.edu'

      expect(classroom_activity.generate_activity_url)
        .to include('http://cooolsville.edu')
    end
  end

  describe '#save_concept_results' do
    let(:activity_session) { create(:activity_session) }
    let(:unit) { create(:unit) }
    let(:concept) { create(:concept) }
    let!(:classroom_activity) { create(:classroom_activity, activity_sessions: [activity_session], unit: unit) }
    let(:concept_results) { [{"activity_session_uid" => activity_session.uid, concept: concept, activity_session: activity_session}] }

    before do
      activity_session.update_attributes(visible: true)
    end

    it 'should create a concept result with the hash given' do
      expect(ConceptResult).to receive(:create).with({"activity_session_id" => activity_session.id, concept: concept, activity_session: activity_session})
      classroom_activity.save_concept_results(concept_results)
    end
  end

  describe '#delete_activity_sessions_with_no_concept_results' do
    let!(:activity_session) { create(:activity_session) }
    let!(:activity_session1) { create(:activity_session) }
    let(:classroom_activity) { create(:classroom_activity) }

    before do
      classroom_activity.activity_sessions << activity_session
      classroom_activity.activity_sessions << activity_session1
      allow(activity_session).to receive(:concept_result_ids).and_return([])
      allow(activity_session1).to receive(:concept_result_ids).and_return(["anything"])
    end

    it 'should delete the activity sessions without the concept results' do
      expect{ classroom_activity.delete_activity_sessions_with_no_concept_results }.to change(ActivitySession, :count).by(-1)
    end
  end

  describe '#teacher_and_classroom_name' do
    it "returns a hash with the name of the owner and the classroom" do
      expect(classroom_activity.teacher_and_classroom_name).to eq({teacher: teacher.name, classroom: classroom.name})
    end
  end

  describe '#activity_session_metadata' do
    let(:concept_result) { create(:concept_result) }
    let!(:activity_session) { create(:activity_session, is_final_score: true) }
    let(:classroom_activity) { create(:classroom_activity) }

    before do
      activity_session.concept_results << concept_result
      classroom_activity.activity_sessions << activity_session
    end

    it 'should return the correct meta data from the concept results' do
      expect(classroom_activity.activity_session_metadata).to include(concept_result.metadata)
    end
  end

  describe '#formatted_due_date' do
    context 'when due date exists' do
      let(:classroom_acitivity) { create(:classroom_acitivity) }

      it 'should return the formatted due date' do
        classroom_activity.due_date = Date.today + 10.days
        expect(classroom_activity.formatted_due_date).to eq(classroom_activity.due_date.strftime("%-m-%-e-%Y"))
      end
    end

    context 'when due date does not exist' do
      let(:classroom_acitivity) { create(:classroom_acitivity) }

      it 'should return emtpty string' do
        classroom_activity.due_date = nil
        expect(classroom_activity.formatted_due_date).to eq("")
      end
    end
  end

  describe '#has_a_started_session?' do
    context 'when session exists' do
      let(:activity_session) { create(:activity_session, state: "started") }
      let(:clasroom_activity) { create(:classroom_activity) }

      before do
        classroom_activity.activity_sessions << activity_session
      end

      it 'should return true' do
        expect(classroom_activity.has_a_started_session?).to eq true
      end
    end

    context 'when session does not exist' do
      let(:clasroom_activity) { create(:classroom_activity) }

      it 'should return false' do
        expect(classroom_activity.has_a_started_session?).to eq false
      end
    end
  end

  describe 'create_session' do
    let(:classroom) { create(:classroom) }
    let(:user) { create(:user) }
    let(:activity) { create(:activity) }
    let(:classroom_activity) { create(:classroom_activity, activity: activity, classroom: classroom) }

    before do
      user.classrooms << classroom
    end

    it 'should create a new activity session' do
      expect{ ClassroomActivity.create_session(activity, {user: user}) }.to change(ActivitySession, :count).by(1)
    end
  end

  describe '#mark_all_activity_sessions_complete' do
    it 'marks all of a classroom activities activity sessions finished' do
      activity_session.update(state: 'started')
      expect(activity_session.state).not_to eq('finished')
      classroom_activity.mark_all_activity_sessions_complete
      expect(activity_session.reload.state).to eq('finished')
    end
  end

  describe '#has_a_completed_session?' do
    it "returns false when a classroom activity has no completed activity sessions" do
      expect(classroom_activity.has_a_completed_session?).to eq(false)
    end

    it "returns true when a classroom activity has at least one completed activity session" do
      activity_session = ActivitySession.create(classroom_activity: classroom_activity, state: 'finished')
      expect(classroom_activity.has_a_completed_session?).to eq(true)
    end
  end

  describe '#from_valid_date_for_activity_analysis?' do
    it 'returns true if the classroom_activity activity_classification id is not 1 or 2' do
      activity.classification = activity_classification_3
      expect(classroom_activity.from_valid_date_for_activity_analysis?).to eq(true)
    end


    it "returns true if it was created after 25-10-2016 and the classification is 1 or 2" do
        classroom_activity.update(created_at: Date.parse('26-10-2016'))
        activity.classification = activity_classification_2
        expect(classroom_activity.from_valid_date_for_activity_analysis?).to eq(true)
    end

    it "returns false if it was created before 25-10-2016 and the classification is 1 or 2" do
        classroom_activity.update(created_at: Date.parse('24-10-2016'))
        activity.classification = activity_classification_2
        expect(classroom_activity.from_valid_date_for_activity_analysis?).to eq(false)
    end
  end

  describe 'gives a checkbox when the teacher' do
      before do
          classroom.update(teacher_id: teacher.id)
      end

      it 'assigns a classroom activity through a custom activity pack' do
          obj = Objective.create(name: 'Build Your Own Activity Pack')
          new_unit = Unit.create(name: 'There is no way a featured activity pack would have this name')
          classroom_activity.update(unit: new_unit)
          expect(classroom_activity.classroom.owner.checkboxes.last.objective).to eq(obj)
      end

      it 'creates a unit with a unit_template_id' do
          ut = UnitTemplate.create(name: 'Adverbs')
          obj = Objective.create(name: 'Assign Featured Activity Pack')
          new_unit = Unit.create(name: 'Adverbs', unit_template_id: ut.id)
          classroom_activity.update!(unit: new_unit)
          expect(classroom_activity.classroom.owner.checkboxes.last.objective).to eq(obj)
      end

      it 'assigns the entry diagnostic' do
          obj = Objective.create(name: 'Assign Entry Diagnostic')
          activity_classification = create(:activity_classification, key: "diagnostic")
          activity = create(:activity, activity_classification_id: activity_classification.id)
          classroom_activity.update!(activity_id: activity.id)
          expect(classroom_activity.classroom.owner.checkboxes.last.objective).to eq(obj)
      end
  end

  context 'when it has a due_date_string attribute' do
      describe '#due_date_string=' do
          it 'must have a due date setter' do
              expect(classroom_activity.due_date_string = '03/02/2012').to eq('03/02/2012')
          end
          it 'must throw an exception whn not valid input' do
              expect { classroom_activity.due_date_string = '03-02-2012' }.to raise_error ArgumentError
          end
      end

      describe '#due_date_string' do
          before do
              classroom_activity.due_date_string = '03/02/2012'
          end
          it 'must have a getter' do
              expect(classroom_activity.due_date_string).to eq('03/02/2012')
          end
      end
  end

  describe '#validate_assigned_student' do

    context 'it must return true when' do

      it 'assign_on_join is true' do
        classroom_activity.assign_on_join = true
        expect(classroom_activity.validate_assigned_student(student.id)).to be true
      end

      it 'assigned_student_ids contains the student id' do
        classroom_activity.assigned_student_ids = [student.id]
        expect(classroom_activity.validate_assigned_student(student.id)).to be true
      end

    end

    it 'must return false when assigned_student_ids does not contain the student id and it was not assigned to the entire classroom' do
      classroom_activity.assigned_student_ids = [student.id + 1]
      expect(classroom_activity.validate_assigned_student(student.id)).to be false
    end
  end

  describe 'validates non-duplicate' do
    it 'will not save a classroom activity with the same unit, activity, visibility, and classroom as another classroom activity' do
      new_ca = ClassroomActivity.create(activity: classroom_activity.activity, classroom: classroom_activity.classroom, unit: classroom_activity.unit)
      expect(new_ca.persisted?).to be false
    end

    it 'will allow a classroom activity with the same unit, activity, and classroom, but different visibility' do
      classroom_activity.update(visible: false)
      new_ca = ClassroomActivity.create(activity: classroom_activity.activity, classroom: classroom_activity.classroom, unit: classroom_activity.unit)
      expect(new_ca.persisted?).to be true
    end
  end

  describe 'locked column' do
    it "exists by default for lessons classroom activities" do
      expect(lessons_classroom_activity.locked).to be(true)
    end

    it "does not exist by default for other classroom activities" do
      expect(classroom_activity.locked).to be(false)
    end
  end



  describe 'caching lessons upon assignemnt' do
    before(:each) do
      $redis.redis.flushdb
    end

    it "creates a redis key for the user if there isn't one" do
      lessons_classroom_activity
      expect($redis.get("user_id:#{lessons_classroom_activity.classroom.owner.id}_lessons_array")).to be
    end

    it "caches data about the assignment" do
      lesson_data = {"classroom_activity_id": lessons_classroom_activity.id, "activity_id": lessons_activity.id , "activity_name": lessons_activity.name, "unit_id": unit.id, "completed": false}
      expect($redis.get("user_id:#{lessons_classroom_activity.classroom.owner.id}_lessons_array")).to eq([lesson_data].to_json)
    end

    it "caches data about subsequent assignment" do
      classroom_2.teachers.destroy_all
      create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom_2.id)
      lesson_1_data = {"classroom_activity_id": lessons_classroom_activity.id, "activity_id": lessons_activity.id , "activity_name": lessons_activity.name, "unit_id": unit.id, "completed": false}
      lesson_2_data = {"classroom_activity_id": lessons_classroom_activity_2.id, "activity_id": lessons_activity.id , "activity_name": lessons_activity.name, "unit_id": unit.id, "completed": false}
      expect($redis.get("user_id:#{lessons_classroom_activity.classroom.owner.id}_lessons_array")).to eq([lesson_1_data, lesson_2_data].to_json)
    end
  end

  describe '#check_for_assign_on_join_and_update_students_array_if_true callback' do
    context 'when assign_on_join is false' do
      describe 'when the assigned students contain all the students in the classroom' do
        it "sets the classroom activity to assign_on_join: true" do
          expect(classroom_activity.assign_on_join).not_to eq(true)
          classroom_activity.update(assigned_student_ids: [student.id])
          expect(classroom_activity.assign_on_join).to eq(true)
        end
      end

      describe 'when the assigned students do not contain all the students in the classroom' do
        it "does not set the classroom activity to assign_on_join: true" do
          expect(classroom_activity.assign_on_join).not_to eq(true)
          classroom_activity.update(assigned_student_ids: [])
          expect(classroom_activity.assign_on_join).not_to eq(true)
        end
      end
    end

    context 'when assign_on_join is true' do
      it "updates the assigned student ids with all students in the classroom" do
          classroom_activity.update(assigned_student_ids: [], assign_on_join: true)
          expect(classroom_activity.assigned_student_ids).to eq([student.id])
      end
    end
  end

  describe '#find_or_create_started_activity_session' do
    it "returns a started activity session if it exists" do
      returned_activity_session = classroom_activity_with_started_activity_session.find_or_create_started_activity_session(student.id)
      expect(returned_activity_session).to eq(started_activity_session)
    end

    it "finds an unstarted activity session if it exists, updates it to started, and returns it" do
      returned_activity_session = classroom_activity.find_or_create_started_activity_session(student.id)
      expect(returned_activity_session).to eq(activity_session)
      expect(returned_activity_session.state).to eq('started')
    end

    it "creates a started activity session if neither a started nor an unstarted one exist" do
      returned_activity_session = classroom_activity_with_no_activity_session.find_or_create_started_activity_session(student.id)
      expect(returned_activity_session.user_id).to eq(student.id)
      expect(returned_activity_session.state).to eq('started')
    end
  end
end
