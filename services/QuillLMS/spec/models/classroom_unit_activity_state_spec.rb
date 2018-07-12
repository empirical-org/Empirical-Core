require 'rails_helper'

describe ClassroomUnitActivityState, type: :model, redis: :true do

  it { should belong_to(:unit_activity) }
  it { should belong_to(:classroom_unit) }

  it { is_expected.to callback(:update_lessons_cache_with_data).after(:save) }
  it { is_expected.to callback(:lock_if_lesson).after(:create) }


  # let!(:activity_classification_3) { create(:activity_classification, id: 3)}
  # let!(:activity_classification_2) { create(:grammar)}
  let!(:activity_classification_6) { create(:lesson)}
  # let!(:diagnostic_activity_classification ) { create(:diagnostic) }
  let!(:activity) { create(:activity, activity_classification_id: 6) }
  let!(:activity2) { create(:activity, activity_classification_id: 6) }
  let!(:student) { create(:user, role: 'student', username: 'great', name: 'hi hi', password: 'pwd') }
  # let!(:diagnostic_activity) { create(:diagnostic_activity, activity_classification_id: diagnostic_activity_classification.id) }
  let!(:classroom) { create(:classroom, students: [student]) }
  let!(:classroom2) { create(:classroom, students: [student]) }
  # let!(:classrooms_teacher) { create(:classrooms_teacher, classroom: classroom, user: teacher)}
  let!(:teacher) {classroom.owner}
  let!(:unit) { create(:unit, name: 'Tapioca', user: teacher) }
  let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity) }
  let!(:unit_activity2) { create(:unit_activity, unit: unit, activity: activity2) }
  let!(:classroom_unit ) { create(:classroom_unit , unit: unit, classroom: classroom, assigned_student_ids: [student.id]) }
  let!(:classroom_unit2 ) { create(:classroom_unit , unit: unit, classroom: classroom2, assigned_student_ids: [student.id]) }
  let!(:cua ) { create(:classroom_unit_activity_state, unit_activity: unit_activity, classroom_unit: classroom_unit)}
  let!(:cua2 ) { create(:classroom_unit_activity_state, unit_activity: unit_activity2, classroom_unit: classroom_unit2)}
  # let!(:activity_session) {create(:activity_session, user_id: student.id, state: 'unstarted', classroom_unit_id: classroom_unit.id)}
  # let(:lessons_activity) { create(:activity, activity_classification_id: 6) }
  # let(:lessons_unit_activity) { create(:unit_activity, unit: unit, activity: lessons_activity) }
  # let(:lessons_unit_activity_2) { create(:unit_activity, unit: unit, activity: lessons_activity) }
  # let!(:unit_activity_with_no_activity_session) { create(:unit_activity, activity: activity) }

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

  # describe 'locked column' do
  #   it "exists by default for lessons classroom activities" do
  #     expect(lessons_unit_activity.locked).to be(true)
  #   end
  #
  #   it "does not exist by default for other classroom activities" do
  #     expect(unit_activity.locked).to be(false)
  #   end
  # end

  describe 'caching lessons upon assignemnt' do
    before(:each) do
      $redis.redis.flushdb
    end

    it "creates a redis key for the user if there isn't one" do
      expect($redis.get("user_id:#{classroom_unit.classroom.owner.id}_lessons_array")).to be
    end

    it "caches data about the assignment" do
      lesson_data = {"classroom_unit_id" => classroom_unit.id,
        "classroom_unit_activity_state_id" => cua.id,
        "activity_id" => activity.id,
        "activity_name" => activity.name,
        "unit_id" => classroom_unit.unit_id,
        "completed" => false
      }
      expect($redis.get("user_id:#{classroom_unit.classroom.owner.id}_lessons_array")).to eq([lesson_data].to_json)
    end

    it "caches data about subsequent assignment" do
      classroom2.teachers.destroy_all
      create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom2.id)
      lesson_data = {"classroom_unit_id" => classroom_unit.id,
        "classroom_unit_activity_state_id" => cua.id,
        "activity_id" => activity.id,
        "activity_name" => activity.name,
        "unit_id" => classroom_unit.unit_id,
        "completed" => false
      }
      lesson_2_data = {"classroom_unit_id" => classroom_unit2.id,
        "classroom_unit_activity_state_id" => cua2.id,
        "activity_id" => activity2.id,
        "activity_name" => activity2.name,
        "unit_id" => classroom_unit2.unit_id,
        "completed" => false
      }
      expect($redis.get("user_id:#{classroom_unit2.classroom.owner.id}_lessons_array")).to eq([lesson_data, lesson_2_data].to_json)
    end
  end

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
