require 'rails_helper'

describe UnitActivity, type: :model, redis: :true do

  it { should belong_to(:activity) }
  it { should belong_to(:unit).touch(true) }
  it { should have_many(:classroom_unit_activity_states) }

  it { is_expected.to callback(:teacher_checkbox).after(:save) }
  it { is_expected.to callback(:hide_appropriate_activity_sessions).after(:save) }

  let!(:activity_classification_3) { create(:activity_classification, id: 3)}
  let!(:activity_classification_2) { create(:grammar)}
  let!(:activity_classification_6) { create(:lesson)}
  let!(:diagnostic_activity_classification ) { create(:diagnostic) }
  let!(:activity) { create(:activity) }
  let!(:diagnostic_activity) { create(:diagnostic_activity, activity_classification_id: diagnostic_activity_classification.id) }
  let!(:student) { create(:user, role: 'student', username: 'great', name: 'hi hi', password: 'pwd') }
  let!(:classroom) { create(:classroom, students: [student]) }
  let!(:classrooms_teacher) { create(:classrooms_teacher, classroom: classroom)}
  let!(:classroom_2) { create(:classroom) }
  let!(:teacher) {classroom.owner}
  let!(:unit) { create(:unit, name: 'Tapioca', user: teacher) }
  let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity) }
  let!(:classroom_unit ) { create(:classroom_unit , unit: unit, classroom: classroom, assigned_student_ids: [student.id]) }
  let!(:activity_session) {create(:activity_session, user_id: student.id, state: 'unstarted', classroom_unit_id: classroom_unit.id)}
  let(:lessons_activity) { create(:activity, activity_classification_id: 6) }
  let(:lessons_unit_activity) { create(:unit_activity, unit: unit, activity: lessons_activity) }
  let(:lessons_unit_activity_2) { create(:unit_activity, unit: unit, activity: lessons_activity) }
  let!(:unit_activity_with_no_activity_session) { create(:unit_activity, activity: activity) }

  # describe '#assign_follow_up_lesson' do
  #   context 'when follow_up_activity_id in activity is absent' do
  #     let(:activity) { create(:activity, follow_up_activity: nil) }
  #     let(:unit_activity) { create(:unit_activity, activity: activity) }
  #
  #     it 'should return false' do
  #       expect(unit_activity.assign_follow_up_lesson).to eq(false)
  #     end
  #   end

  #   context 'when unit activity does not exist' do
  #     let(:classroom) { create(:classroom) }
  #     let(:follow_up_activity) { create(:activity) }
  #     let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }
  #     let(:unit_activity) { build(:unit_activity, classroom: classroom) }
  #
  #     it 'should create the unit activity' do
  #       created_activity = unit_activity.assign_follow_up_lesson
  #       expect(created_activity.activity_id).to eq(unit_activity.activity_id)
  #       expect(created_activity.unit_id).to eq(unit_activity.unit_id)
  #       expect(created_activity.visible).to eq(true)
  #     end
  #   end
  # end

  # describe '#save_concept_results' do
  #   let(:unit) { create(:unit) }
  #   let(:concept) { create(:concept) }
  #   let!(:unit_activity) { create(:unit_activity, activity: activity, unit: unit) }
  #   let(:activity_session) { create(:activity_session, unit_activity_id: unit_activity.id, student_id: student.id) }
  #   let(:concept_results) { [{"activity_session_uid" => activity_session.uid, concept: concept, activity_session: activity_session}] }
  #
  #   before do
  #     activity_session.update_attributes(visible: true)
  #   end
  #
  #   it 'should create a concept result with the hash given' do
  #     expect(ConceptResult).to receive(:create).with({"activity_session_id" => activity_session.id, concept: concept, activity_session: activity_session})
  #     unit_activity.save_concept_results(concept_results)
  #   end
  # end

  # describe '#delete_activity_sessions_with_no_concept_results' do
  #   let!(:activity_session) { create(:activity_session) }
  #   let!(:activity_session1) { create(:activity_session) }
  #   let(:unit_activity) { create(:unit_activity) }
  #
  #   before do
  #     unit_activity.activity_sessions << activity_session
  #     unit_activity.activity_sessions << activity_session1
  #     allow(activity_session).to receive(:concept_result_ids).and_return([])
  #     allow(activity_session1).to receive(:concept_result_ids).and_return(["anything"])
  #   end
  #
  #   it 'should delete the activity sessions without the concept results' do
  #     expect{ unit_activity.delete_activity_sessions_with_no_concept_results }.to change(ActivitySession, :count).by(-1)
  #   end
  # end

  describe '#formatted_due_date' do
    context 'when due date exists' do
      let(:classroom_acitivity) { create(:classroom_acitivity) }

      it 'should return the formatted due date' do
        unit_activity.due_date = Date.today + 10.days
        expect(unit_activity.formatted_due_date).to eq(unit_activity.due_date.strftime("%-m-%-e-%Y"))
      end
    end

    context 'when due date does not exist' do
      let(:classroom_acitivity) { create(:classroom_acitivity) }

      it 'should return emtpty string' do
        unit_activity.due_date = nil
        expect(unit_activity.formatted_due_date).to eq("")
      end
    end
  end

  # describe '#has_a_started_session?' do
  #   context 'when session exists' do
  #     let(:activity_session) { create(:activity_session, state: "started") }
  #     let(:clasroom_activity) { create(:unit_activity) }
  #
  #     before do
  #       unit_activity.activity_sessions << activity_session
  #     end
  #
  #     it 'should return true' do
  #       expect(unit_activity.has_a_started_session?).to eq true
  #     end
  #   end
  #
  #   context 'when session does not exist' do
  #     let(:clasroom_activity) { create(:unit_activity) }
  #
  #     it 'should return false' do
  #       expect(unit_activity.has_a_started_session?).to eq false
  #     end
  #   end
  # end

  # describe '#mark_all_activity_sessions_complete' do
  #   it 'marks all of a classroom activities activity sessions finished' do
  #     activity_session.update(state: 'started')
  #     expect(activity_session.state).not_to eq('finished')
  #     unit_activity.mark_all_activity_sessions_complete
  #     expect(activity_session.reload.state).to eq('finished')
  #   end
  # end

  # describe '#has_a_completed_session?' do
  #   it "returns false when a unit activity has no completed activity sessions" do
  #     expect(unit_activity.has_a_completed_session?).to eq(false)
  #   end
  #
  #   it "returns true when a unit activity has at least one completed activity session" do
  #     activity_session = ActivitySession.create(unit_activity: unit_activity, state: 'finished')
  #     expect(unit_activity.has_a_completed_session?).to eq(true)
  #   end
  # end

  describe '#from_valid_date_for_activity_analysis?' do
    it 'returns true if the unit_activity activity_classification id is not 1 or 2' do
      activity.classification = activity_classification_3
      expect(unit_activity.from_valid_date_for_activity_analysis?).to eq(true)
    end


    it "returns true if it was created after 25-10-2016 and the classification is 1 or 2" do
        unit_activity.update(created_at: Date.parse('26-10-2016'))
        activity.classification = activity_classification_2
        expect(unit_activity.from_valid_date_for_activity_analysis?).to eq(true)
    end

    it "returns false if it was created before 25-10-2016 and the classification is 1 or 2" do
        unit_activity.update(created_at: Date.parse('24-10-2016'))
        activity.classification = activity_classification_2
        expect(unit_activity.from_valid_date_for_activity_analysis?).to eq(false)
    end
  end

  describe 'gives a checkbox when the teacher' do
      before do
          classroom.update(teacher_id: teacher.id)
      end

      it 'assigns a unit activity through a custom activity pack' do
          obj = Objective.create(name: 'Build Your Own Activity Pack')
          new_unit = Unit.create(name: 'There is no way a featured activity pack would have this name', user: teacher)
          unit_activity.update(unit: new_unit)
          expect(unit_activity.unit.user.checkboxes.last.objective).to eq(obj)
      end

      it 'creates a unit with a unit_template_id' do
          ut = UnitTemplate.create(name: 'Adverbs')
          obj = Objective.create(name: 'Assign Featured Activity Pack')
          new_unit = Unit.create(name: 'Adverbs', unit_template_id: ut.id, user: teacher)
          unit_activity.update!(unit: new_unit)
          expect(unit_activity.unit.user.checkboxes.last.objective).to eq(obj)
      end

      it 'assigns the entry diagnostic' do
          obj = Objective.create(name: 'Assign Entry Diagnostic')
          unit_activity.update!(activity_id: diagnostic_activity.id)
          expect(unit_activity.unit.user.checkboxes.last.objective).to eq(obj)
      end
  end

  context 'when it has a due_date_string attribute' do
      describe '#due_date_string=' do
          it 'must have a due date setter' do
              expect(unit_activity.due_date_string = '03/02/2012').to eq('03/02/2012')
          end
          it 'must throw an exception whn not valid input' do
              expect { unit_activity.due_date_string = '03-02-2012' }.to raise_error ArgumentError
          end
      end

      describe '#due_date_string' do
          before do
              unit_activity.due_date_string = '03/02/2012'
          end
          it 'must have a getter' do
              expect(unit_activity.due_date_string).to eq('03/02/2012')
          end
      end
  end

  # describe 'locked column' do
  #   it "exists by default for lessons classroom activities" do
  #     expect(lessons_unit_activity.locked).to be(true)
  #   end
  #
  #   it "does not exist by default for other classroom activities" do
  #     expect(unit_activity.locked).to be(false)
  #   end
  # end

  # describe 'caching lessons upon assignemnt' do
  #   before(:each) do
  #     $redis.redis.flushdb
  #   end
  #
  #   it "creates a redis key for the user if there isn't one" do
  #     lessons_unit_activity
  #     expect($redis.get("user_id:#{lessons_unit_activity.classroom.owner.id}_lessons_array")).to be
  #   end
  #
  #   it "caches data about the assignment" do
  #     lesson_data = {"unit_activity_id": lessons_unit_activity.id, "activity_id": lessons_activity.id , "activity_name": lessons_activity.name, "unit_id": unit.id, "completed": false}
  #     expect($redis.get("user_id:#{lessons_unit_activity.classroom.owner.id}_lessons_array")).to eq([lesson_data].to_json)
  #   end
  #
  #   it "caches data about subsequent assignment" do
  #     classroom_2.teachers.destroy_all
  #     create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom_2.id)
  #     lesson_1_data = {"unit_activity_id": lessons_unit_activity.id, "activity_id": lessons_activity.id , "activity_name": lessons_activity.name, "unit_id": unit.id, "completed": false}
  #     lesson_2_data = {"unit_activity_id": lessons_unit_activity_2.id, "activity_id": lessons_activity.id , "activity_name": lessons_activity.name, "unit_id": unit.id, "completed": false}
  #     expect($redis.get("user_id:#{lessons_unit_activity.classroom.owner.id}_lessons_array")).to eq([lesson_1_data, lesson_2_data].to_json)
  #   end
  # end

  # describe '#find_or_create_started_activity_session' do
  #   it "returns a started activity session if it exists" do
  #     returned_activity_session = unit_activity_with_started_activity_session.find_or_create_started_activity_session(student.id)
  #     expect(returned_activity_session).to eq(started_activity_session)
  #   end
  #
  #   it "finds an unstarted activity session if it exists, updates it to started, and returns it" do
  #     returned_activity_session = unit_activity.find_or_create_started_activity_session(student.id)
  #     expect(returned_activity_session).to eq(activity_session)
  #     expect(returned_activity_session.state).to eq('started')
  #   end
  #
  #   it "creates a started activity session if neither a started nor an unstarted one exist" do
  #     returned_activity_session = unit_activity_with_no_activity_session.find_or_create_started_activity_session(student.id)
  #     expect(returned_activity_session.user_id).to eq(student.id)
  #     expect(returned_activity_session.state).to eq('started')
  #   end
  # end
end
