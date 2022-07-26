# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_sessions
#
#  id                    :integer          not null, primary key
#  completed_at          :datetime
#  data                  :jsonb
#  is_final_score        :boolean          default(FALSE)
#  is_retry              :boolean          default(FALSE)
#  percentage            :float
#  started_at            :datetime
#  state                 :string           default("unstarted"), not null
#  temporary             :boolean          default(FALSE)
#  timespent             :integer
#  uid                   :string
#  visible               :boolean          default(TRUE), not null
#  created_at            :datetime
#  updated_at            :datetime
#  activity_id           :integer
#  classroom_activity_id :integer
#  classroom_unit_id     :integer
#  pairing_id            :string
#  user_id               :integer
#
# Indexes
#
#  index_activity_sessions_on_activity_id            (activity_id)
#  index_activity_sessions_on_classroom_activity_id  (classroom_activity_id)
#  index_activity_sessions_on_classroom_unit_id      (classroom_unit_id)
#  index_activity_sessions_on_completed_at           (completed_at)
#  index_activity_sessions_on_pairing_id             (pairing_id)
#  index_activity_sessions_on_started_at             (started_at)
#  index_activity_sessions_on_state                  (state)
#  index_activity_sessions_on_uid                    (uid) UNIQUE
#  index_activity_sessions_on_user_id                (user_id)
#
require 'rails_helper'


describe ActivitySession, type: :model, redis: true do

  it { should belong_to(:classroom_unit).touch(true) }
  it { should belong_to(:activity) }
  it { should have_one(:classification).through(:activity) }
  it { should have_many(:user_activity_classifications).through(:classification) }
  it { should have_many(:feedback_sessions) }
  it { should have_many(:feedback_histories).through(:feedback_sessions) }
  it { should have_one(:classroom).through(:classroom_unit) }
  it { should have_one(:unit).through(:classroom_unit) }
  it { should have_many(:concept_results) }
  it { should have_many(:concepts).through(:old_concept_results) }
  it { should have_many(:teachers).through(:classroom) }
  it { should belong_to(:user) }

  it { is_expected.to callback(:set_state).before(:create) }
  it { is_expected.to callback(:set_completed_at).before(:save) }
  it { is_expected.to callback(:set_activity_id).before(:save) }
  it { is_expected.to callback(:determine_if_final_score).after(:save) }
  it { is_expected.to callback(:update_milestones).after(:save) }
  it { is_expected.to callback(:increment_counts).after(:save) }
  it { is_expected.to callback(:invalidate_activity_session_count_if_completed).after(:commit) }
  it { is_expected.to callback(:trigger_events).around(:save) }

  describe "can behave like an uid class" do
    context "when behaves like uid" do
      it_behaves_like "uid"
    end
  end

  describe '.assign_follow_up_lesson' do
    context 'when follow_up_activity_id in activity is absent' do
      let(:unit) { create(:unit) }
      let(:classroom_unit) { create(:classroom_unit, unit: unit) }
      let(:activity) { create(:activity, follow_up_activity: nil) }
      let!(:activity_session) do
        create(:activity_session,
          activity: activity,
          classroom_unit: classroom_unit
        )
      end

      it 'should return false' do
        result = ActivitySession.assign_follow_up_lesson(
          classroom_unit.id,
          activity.uid,
        )

        expect(result).to eq(false)
      end
    end

    context 'when neither unit activity nor classroom activity unit state exist' do
      let(:unit) { create(:unit) }
      let(:classroom_unit) { create(:classroom_unit, unit: unit) }
      let(:follow_up_activity) { create(:activity) }
      let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }
      let!(:activity_session) do
        create(:activity_session,
          activity: activity,
          classroom_unit: classroom_unit
        )
      end

      it 'should create the unit_activity and the classroom unit activity state' do
        unit_activity = ActivitySession.assign_follow_up_lesson(
          classroom_unit.id,
          activity.id,
        )
        expect(unit_activity.activity_id).to eq(follow_up_activity.id)
        expect(unit_activity.unit_id).to eq(unit.id)
        expect(unit_activity.visible).to eq(true)
        expect(unit_activity.classroom_unit_activity_states.first).to be
      end
    end

    context 'when unit activity exists but classroom unit activity state does not' do
      let(:unit) { create(:unit) }
      let(:classroom_unit) { create(:classroom_unit, unit: unit) }
      let(:follow_up_activity) { create(:activity) }
      let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }
      let!(:unit_activity) { create(:unit_activity, unit: unit, activity: follow_up_activity)}
      let!(:activity_session) do
        create(:activity_session,
          activity: activity,
          classroom_unit: classroom_unit
        )
      end

      it 'should return the unit_activity and create a classroom activity unit state' do
        follow_up_unit_activity = ActivitySession.assign_follow_up_lesson(
          classroom_unit.id,
          activity.id,
        )
        expect(follow_up_unit_activity.id).to eq(unit_activity.id)
        expect(unit_activity.classroom_unit_activity_states.first).to be
      end
    end

    context 'when unit activity exists but is archived and classroom unit activity state does not exist' do
      let(:unit) { create(:unit) }
      let(:classroom_unit) { create(:classroom_unit, unit: unit) }
      let(:follow_up_activity) { create(:activity) }
      let(:activity) { create(:activity, follow_up_activity: follow_up_activity) }
      let!(:unit_activity) { create(:unit_activity, unit: unit, activity: follow_up_activity, visible: false)}
      let!(:activity_session) do
        create(:activity_session,
          activity: activity,
          classroom_unit: classroom_unit
        )
      end

      it 'should return the unit_activity, make it visible, and create a classroom activity unit state' do
        follow_up_unit_activity = ActivitySession.assign_follow_up_lesson(
          classroom_unit.id,
          activity.id,
        )
        expect(follow_up_unit_activity.id).to eq(unit_activity.id)
        expect(follow_up_unit_activity.visible).to eq(true)
        expect(unit_activity.classroom_unit_activity_states.first).to be
      end
    end
  end

  describe "self.average_scores_by_student" do
    let(:student) { create(:student) }

    it 'should return empty hash for no sessions' do
      averages = ActivitySession.average_scores_by_student(student.id)
      expect(averages).to be_empty
      expect(averages.class).to be Hash
    end

    context 'with non-graded sessions' do
      before do
        create(:diagnostic_activity_session, :finished, user: student)
      end

      it 'should return empty hash for non-graded sessions' do
        averages = ActivitySession.average_scores_by_student(student.id)
        expect(averages).to be_empty
        expect(averages.class).to be Hash
      end
    end

    context 'with graded sessions' do
      before do
        create(:grammar_activity_session, :finished, user: student, percentage: 0.60)
        create(:grammar_activity_session, :finished, user: student, percentage: 0.50)
      end

      it 'should return average of scores' do
        averages = ActivitySession.average_scores_by_student(student.id)

        expect(averages[student.id]).to eq(55)
      end
    end
  end

  describe '#classroom_owner' do
    let(:classroom) { build(:classroom) }
    let(:owner) { build(:teacher) }
    let(:classroom_unit) { build(:classroom_unit, classroom: classroom) }
    let(:activity_session) { build(:activity_session, classroom_unit: classroom_unit) }

    before do
      allow(classroom).to receive(:owner) { owner }
    end

    it 'should give the classroom owner of the classroom unit' do
      expect(activity_session.classroom_owner).to eq owner
    end
  end

  describe '#eligible_for_tracking?' do
    context 'when classroom_unit, classroom, or owner absent' do
      let(:activity_session) { build_stubbed(:activity_session) }

      before do
        allow(activity_session).to receive(:classroom_unit) { nil }
      end

      it 'should return false' do
        expect(activity_session.eligible_for_tracking?).to eq false
      end
    end

    context 'when classroom unit, classroom and owner present' do
      let(:classroom) { build(:classroom) }
      let(:owner) { build(:teacher) }
      let(:classroom_unit) { build(:classroom_unit, classroom: classroom) }
      let(:activity_session) { build(:activity_session, classroom_unit: classroom_unit) }

      before do
        allow(classroom).to receive(:owner) { owner }
      end

      it 'should return true' do
        expect(activity_session.eligible_for_tracking?).to eq true
      end
    end
  end

  describe 'paginate' do
    let(:activity_session) { create(:activity_session) }
    let(:activity_session1) { create(:activity_session) }
    let(:activity_session2) { create(:activity_session) }

    it 'should give the required number of results' do
      expect(ActivitySession.paginate(1, 2)).to include(activity_session, activity_session1)
    end
  end

  describe 'with_best_scores' do
    let(:activity_session) { create(:activity_session, is_final_score: true) }
    let(:activity_session1) { create(:activity_session, is_final_score: false) }

    it 'should return the sessions with final score true' do
      expect(ActivitySession.with_best_scores).to include(activity_session)
    end
  end

  describe 'RESULTS_PER_PAGE' do
    it 'should be the correct number' do
      expect(ActivitySession::RESULTS_PER_PAGE).to eq 25
    end
  end

  let(:activity_session) { build(:activity_session, completed_at: 5.minutes.ago) }

  describe "#activity" do

    context "when there is a direct activity association" do

    let(:activity){ create(:activity) }
    let(:activity_session){ build(:activity_session,activity_id: activity.id) }

    it "must return the associated activity" do
       expect(activity_session.activity).to eq activity
     end

  end

    describe "#invalidate_activity_session_count_if_completed" do
      let!(:student){ create(:student, :in_one_classroom) }
      let!(:classroom_unit) { create(:classroom_unit, classroom_id: student.classrooms.first.id, assigned_student_ids: [student.id]) }
      let!(:activity_session){   create(:activity_session, classroom_unit: classroom_unit, state: 'not validated')}

      before do
        $redis.set("classroom_id:#{student.classrooms.first.id}_completed_activity_count", 10)
      end

      it "deletes redis cache when an activity with a classroom's state is finished" do
        activity_session.update(state: 'finished')
        activity_session.invalidate_activity_session_count_if_completed
        expect($redis.get("classroom_id:#{student.classrooms.first.id}_completed_activity_count")).not_to be
      end

      it "does nothing to redis cache when any other classroom attribute changes" do
        activity_session.update(visible: false)
        activity_session.invalidate_activity_session_count_if_completed
        expect($redis.get("classroom_id:#{student.classrooms.first.id}_completed_activity_count")).to eq('10')
      end

    end

    context "when there's not an associated activity but there's a classroom unit and only one unit activity" do

      let!(:activity){ create(:activity) }
      let!(:student){ create(:student, :in_one_classroom) }
      let!(:classroom_unit) { create(:classroom_unit, assigned_student_ids: [student.id], classroom_id: student.classrooms.first.id) }
      let!(:unit_activity ) { create(:unit_activity, activity: activity, unit: classroom_unit.unit)}
      let(:activity_session){   build(:activity_session, classroom_unit: classroom_unit)                     }

      it "must return the unit activity's activity" do
         activity_session.activity_id=nil
         unit_activity.unit.reload
         expect(activity_session.activity).to eq unit_activity.activity
       end

    end

  end

  describe "#activity_uid=" do

    let(:activity){ create(:activity) }

    it "must associate activity by uid" do
      activity_session.activity_id=nil
      activity_session.activity_uid=activity.uid
      expect(activity_session.activity_id).to eq activity.id
    end

  end

  describe '#formatted_due_date' do
    context 'when classroom_unit is nil' do
      let(:activity_session) { create(:activity_session, classroom_unit: nil) }

      it 'should return nil' do
        expect(activity_session.formatted_due_date).to eq(nil)
      end
    end

    context 'when unit_activity does not have a due date' do
      let(:classroom_unit) { create(:classroom_unit) }
      let(:unit_activity) { create(:unit_activity, unit: classroom_unit.unit, due_date: nil) }
      let(:activity_session) { create(:activity_session, classroom_unit: classroom_unit) }

      it 'should return nil' do
        expect(activity_session.formatted_due_date).to eq(nil)
      end
    end

    context 'when unit_activity has a due date' do
      let(:unit) { create(:unit)}
      let(:classroom_unit) { create(:classroom_unit, unit: unit) }
      let(:unit_activity) { create(:unit_activity, unit: unit, due_date: 10.days.from_now) }
      let(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: unit_activity.activity) }

      it 'should return the formatted due date of the unit activity' do
        unit.reload
        expect(activity_session.formatted_due_date).to eq 10.days.from_now.strftime("%A, %B %d, %Y")
      end
    end
  end

  describe '#formatted_completed_at' do
    context 'when completed_at is nil' do
      let(:activity_session) { create(:activity_session) }

      it 'should return nil' do
        activity_session.completed_at = nil
        expect(activity_session.formatted_completed_at).to eq(nil)
      end
    end

    context 'when completed at is present' do
      let(:activity_session) { create(:activity_session, completed_at: Date.current) }

      it 'should return the formatted completed at' do
        expect(activity_session.formatted_completed_at).to eq(Date.current.strftime('%A, %B %d, %Y'))
      end
    end
  end

  describe '#display_due_date_or_completed_at_date' do
    context 'when completed at present' do
      let(:activity_session) { create(:activity_session, completed_at: Date.current) }

      it 'should return the formatted completed at date' do
        expect(activity_session.display_due_date_or_completed_at_date).to eq(Date.current.strftime('%A, %B %d, %Y'))
      end
    end

    context 'when classroom_unit and unit_activity present' do
      context 'when due date present' do
        let(:student) { create(:student) }
        let(:classroom_unit) { create(:classroom_unit, assigned_student_ids: [student.id])}
        let(:unit_activity) { create(:unit_activity, unit: classroom_unit.unit, due_date: 2.days.from_now) }

        let(:activity_session) do
          create(:activity_session, classroom_unit: classroom_unit, user: student, activity: unit_activity.activity)
        end

        it 'should return the formatted due date for the classroom_unit' do
          activity_session.completed_at = nil
          activity_session.unit.reload
          expect(activity_session.display_due_date_or_completed_at_date).to eq 2.days.from_now.strftime('%A, %B %d, %Y')
        end
      end

      context 'when due date is not present' do
        let(:classroom_unit) { create(:classroom_unit) }
        let(:unit_activity) { create(:unit_activity, unit: classroom_unit.unit, due_date:  nil) }
        let(:activity_session) { create(:activity_session, classroom_unit: classroom_unit) }

        it 'should return empty string' do
          activity_session.completed_at = nil
          expect(activity_session.display_due_date_or_completed_at_date).to eq ''
        end
      end
    end

    context 'when neither is present' do
      let(:activity_session) { create(:activity_session, classroom_unit: nil, completed_at: nil) }

      it 'should return empty string' do
        activity_session.completed_at = nil
        expect(activity_session.display_due_date_or_completed_at_date).to eq ''
      end
    end
  end

  describe '#percentile' do
    let(:activity_session) { create(:activity_session) }
    let(:fake) { double(:fake) }

    it 'should call proficiency evaluator and get lump into center of proficiency band' do
      expect(ProficiencyEvaluator).to receive(:lump_into_center_of_proficiency_band).with(activity_session.percentage).and_return(fake)
      expect(activity_session.percentile).to eq fake
    end
  end

  describe '#percentage_as_decimal' do
    let(:activity_session) { create(:activity_session, percentage: 0.4) }

    it 'should return the percentage in decimal form' do
      expect(activity_session.percentage_as_decimal).to eq(activity_session.percentage.round(2))
    end
  end

  describe '#percentage_as_percent' do
  context 'when percentage is nil' do
  let(:activity_session) { create(:activity_session, percentage: nil) }

  it 'should return no percentage' do
    expect(activity_session.percentage_as_percent).to eq("no percentage")
  end
end

  context 'when percentage is present' do
    let(:activity_session) { create(:activity_session, percentage: 0.4) }

    it 'should return the formatted percentage' do
      expect(activity_session.percentage_as_percent).to eq("40%")
    end
  end
end

  describe 'score' do
    let(:activity_session) { create(:activity_session, percentage: 0.4) }

    it 'should return the percentage' do
      expect(activity_session.score).to eq((activity_session.percentage*100).round)
    end
  end

  describe '#start' do
    context 'when state is not unstarted' do
      let(:activity_session) { create(:activity_session, state: "started") }

      it 'should not set the started_at and not change the state' do
        activity_session.start
        expect(activity_session.started_at).to eq(nil)
        expect(activity_session.state).to eq("started")
      end
    end

    context 'when state is unstarted' do
      let(:time) { Time.utc("100") }
      let(:activity_session) { create(:activity_session, state: "unstarted") }

      before { allow(Time).to receive(:current).and_return(time) }

      it 'should set the started at and change the state' do
        activity_session.start
        expect(activity_session.started_at).to eq(time)
        expect(activity_session.state).to eq("started")
      end
    end
  end

  describe '#parse_for_results' do
    let!(:activity_session) { create(:activity_session) }
    let!(:proficient_concept) { create(:concept)}
    let!(:proficient_concept_result) { create(:concept_result_with_correct_answer, concept: proficient_concept, activity_session: activity_session)}
    let!(:nearly_proficient_concept) { create(:concept)}
    let!(:nearly_proficient_concept_result_positive1) { create(:concept_result_with_correct_answer, concept: nearly_proficient_concept, activity_session: activity_session)}
    let!(:nearly_proficient_concept_result_positive2) { create(:concept_result_with_correct_answer, concept: nearly_proficient_concept, activity_session: activity_session)}
    let!(:nearly_proficient_concept_result_negative) { create(:concept_result_with_incorrect_answer, concept: nearly_proficient_concept, activity_session: activity_session)}
    let!(:not_yet_proficient_concept) { create(:concept)}
    let!(:not_yet_proficient_concept_result) { create(:concept_result_with_incorrect_answer, concept: not_yet_proficient_concept, activity_session: activity_session)}
    let!(:ignored_concept) { create(:concept, uid: ActivitySession::CONCEPT_UIDS_TO_EXCLUDE_FROM_REPORT[0])}
    let!(:ignored_concept_result) { create(:concept_result_with_incorrect_answer, concept: ignored_concept, activity_session: activity_session)}

    it 'should return an object with concept results organized by category' do
      expect(activity_session.parse_for_results[ActivitySession::PROFICIENT]).to be_present
      expect(activity_session.parse_for_results[ActivitySession::NEARLY_PROFICIENT]).to be_present
      expect(activity_session.parse_for_results[ActivitySession::NOT_YET_PROFICIENT]).to be_present
    end

    it 'should return concept results that averaged 80% or higher in the PROFICIENT category' do
      expect(activity_session.parse_for_results[ActivitySession::PROFICIENT]).to include(proficient_concept.name)
    end

    it 'should return concept results that averaged 60% or higher in the NEARLY PROFICIENT category' do
      expect(activity_session.parse_for_results[ActivitySession::NEARLY_PROFICIENT]).to include(nearly_proficient_concept.name)
    end

    it 'should return concept results that averaged below 60 in the NOT YET PROFICIENT category' do
      expect(activity_session.parse_for_results[ActivitySession::NOT_YET_PROFICIENT]).to include(not_yet_proficient_concept.name)
    end

    it 'should not return the ignored concept result in any category if there are fewer than four concept results for it' do
      expect(activity_session.parse_for_results[ActivitySession::PROFICIENT]).not_to include(ignored_concept.name)
      expect(activity_session.parse_for_results[ActivitySession::NEARLY_PROFICIENT]).not_to include(ignored_concept.name)
      expect(activity_session.parse_for_results[ActivitySession::NOT_YET_PROFICIENT]).not_to include(ignored_concept.name)
    end

    it 'should return the ignored concept result if there are at least four concept results for it' do
      3.times do |i|
        ignored_concept_result.id = nil
        OldConceptResult.create(ignored_concept_result.attributes)
      end
      expect(activity_session.parse_for_results[ActivitySession::NOT_YET_PROFICIENT]).to include(ignored_concept.name)
    end
  end

  describe "#activity_uid" do

    it "must return an uid when activity is present" do
      expect(activity_session.activity_uid).to be_present
    end

  end

  describe 'search_sort_sql' do
    it 'should return the right string for the right field' do
      last_name = "substring(users.name, '(?=\s).*')"
      expect(ActivitySession.search_sort_sql({field: 'activity_classification_name', direction: "desc"})).to eq("activity_classifications.name desc, #{last_name} desc")
      expect(ActivitySession.search_sort_sql({field: 'student_name', direction: "desc"})).to eq("#{last_name} desc, users.name desc")
      expect(ActivitySession.search_sort_sql({field: 'completed_at', direction: "desc"})).to eq("activity_sessions.completed_at desc")
      expect(ActivitySession.search_sort_sql({field: 'activity_name', direction: "anything"})).to eq("activities.name asc")
      expect(ActivitySession.search_sort_sql({field: 'percentage', direction: "anything"})).to eq("activity_sessions.percentage asc")
      expect(ActivitySession.search_sort_sql({field: 'standard', direction: "anything"})).to eq("standards.name asc")
      expect(ActivitySession.search_sort_sql({field: ''})).to eq("#{last_name} asc, users.name asc")
      expect(ActivitySession.search_sort_sql({})).to eq("#{last_name} asc, users.name asc")
    end
  end

  describe "#completed?" do
    it "must be true when completed_at is present" do
      expect(activity_session).to be_completed
    end

    it "must be false when cmopleted_at is not present" do
      activity_session.completed_at=nil
      expect(activity_session).to_not be_completed
    end
  end

  describe "#by_teacher" do
    # This setup is very convoluted... the factories appear to be untrustworthy w/r/t generating extra records
    let!(:current_classroom) { create(:classroom_with_one_student) }
    let(:current_teacher) { current_classroom.owner }
    let!(:current_student) {current_classroom.students.first}
    let!(:current_teacher_classroom_unit) { create(:classroom_unit, classroom: current_classroom)}
    let!(:other_classroom) { create(:classroom_with_one_student) }
    let(:other_teacher) { other_classroom.owner }
    let!(:other_student) {other_classroom.students.first}
    let!(:other_teacher_classroom_unit) { create(:classroom_unit, classroom: other_classroom)}

    before do
      # Can't figure out why the setup above creates 2 activity sessions
      ActivitySession.destroy_all
      create_list(:activity_session, 2, classroom_unit: current_teacher_classroom_unit, user: current_student)
      create_list(:activity_session, 3, classroom_unit: other_teacher_classroom_unit, user: other_student)
    end

    it "only retrieves activity sessions for the students who have that teacher" do
      results = ActivitySession.by_teacher(current_teacher)
      expect(results.size).to eq(2)
    end
  end

  #--- legacy methods

  describe "#grade" do
    it "must be equal to percentage" do
      expect(activity_session.grade).to eq activity_session.percentage
    end

  end

  describe "#anonymous=" do
    it "must be equal to temporary" do
      expect(activity_session.anonymous=true).to eq activity_session.temporary
    end

    it "must return temporary" do
      activity_session.anonymous=true
      expect(activity_session.anonymous).to eq activity_session.temporary
    end
  end


  context "when before_create is fired" do
    describe "#set_state" do

      it "must set state as unstarted" do
        activity_session.state=nil
        activity_session.save!
        expect(activity_session.state).to eq "unstarted"
      end
    end
  end

  context "when before_save is triggered" do

    describe "#set_completed_at when state = finished" do
      before do
        activity_session.save!
        activity_session.state="finished"
      end

      context "when completed_at is already set" do
        before { activity_session.completed_at = 5.minutes.ago }

        it "should not change completed at" do
          expect {
            activity_session.save!
          }.to_not change {
            activity_session.reload.completed_at
          }
        end
      end

      context "when completed_at is not already set" do
        before do
          activity_session.completed_at = nil
          activity_session.save!
        end

        it "should update completed_at" do
          expect(activity_session.completed_at).to_not be_nil
        end
      end
    end

  end

  context "when completed scope" do
    describe ".completed" do
      before { create_list(:activity_session, 3) }

      it "must locate all the completed items" do
        expect(ActivitySession.completed.count).to eq 3
      end

      it "completed_at must be present" do
        ActivitySession.completed.each do |item|
          expect(item.completed_at).to be_present
        end
      end

      it "must order by date desc" do
        #TODO: This test is not passing cause the ordering is wrong
        # p completed=ActivitySession.completed
        # current_date=completed.first.completed_at
        # completed.each do |item|
        # 	expect(item.completed_at).to satisfy { |x| p x.to_s+" <= "+current_date.to_s ||x <= current_date  }
        # 	current_date=item.completed_at
        # end
      end
    end
  end

  context "when incompleted scope" do
    describe ".incomplete" do
      before { create_list(:activity_session, 2, :unstarted) }

      it "must locate all the incompleted items" do
        expect(ActivitySession.incomplete.count).to eq 2
      end

      it "completed_at must be nil" do
        ActivitySession.incomplete.each do |item|
          expect(item.completed_at).to be_nil
        end
      end
    end
  end

  describe '#determine_if_final_score' do
    let(:classroom) {create(:classroom)}
    let(:student) {create(:student)}
    let(:activity) {create(:activity)}

    let(:classroom_unit)   { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id])}
    let(:previous_final_score) { create(:activity_session, completed_at: Time.current, percentage: 0.9, is_final_score: true, user: student, classroom_unit: classroom_unit, activity: activity)}

    it 'updates when new activity session has higher percentage' do
      previous_final_score
      new_activity_session = create(:activity_session, is_final_score: false, user: student, classroom_unit: classroom_unit, activity: activity)
      new_activity_session.update(completed_at: Time.current, state: 'finished', percentage: 0.95)
      expect([ActivitySession.find(previous_final_score.id).reload.is_final_score, ActivitySession.find(new_activity_session.id).reload.is_final_score]).to eq([false, true])
    end

    it 'updates when new activity session has equal percentage' do
      previous_final_score
      new_activity_session = create(:activity_session, is_final_score: false, user: student, classroom_unit: classroom_unit, activity: activity)
      new_activity_session.update(completed_at: Time.current, state: 'finished', percentage: previous_final_score.percentage)
      expect([ActivitySession.find(previous_final_score.id).reload.is_final_score, ActivitySession.find(new_activity_session.id).reload.is_final_score]).to eq([false, true])
    end

    it 'updates when new and old session percentages are nil' do
      previous_final_score
      previous_final_score.update(percentage: nil)
      new_activity_session = create(:activity_session, is_final_score: false, user: student, classroom_unit: classroom_unit, activity: activity)
      new_activity_session.update(completed_at: Time.current, state: 'finished', percentage: nil)
      expect([ActivitySession.find(previous_final_score.id).reload.is_final_score, ActivitySession.find(new_activity_session.id).reload.is_final_score]).to eq([false, true])
    end

    it 'updates when the ActivityClassification.key is "evidence" even if the percentage is nil' do
      classification = create(:activity_classification, key: 'evidence')
      activity
      activity.update(classification: classification)
      previous_final_score
      previous_final_score.update(percentage: nil)
      new_activity_session = create(:activity_session, is_final_score: false, user: student, classroom_unit: classroom_unit, activity: activity)
      new_activity_session.update(completed_at: Time.current, state: 'finished', percentage: nil)
      expect([ActivitySession.find(previous_final_score.id).reload.is_final_score, ActivitySession.find(new_activity_session.id).reload.is_final_score]).to eq([false, true])
    end

    it 'doesnt update when new activity session has lower percentage' do
      previous_final_score
      new_activity_session = create(:activity_session, completed_at: Time.current, state: 'finished', percentage: 0.5, is_final_score: false, user: student, classroom_unit: classroom_unit, activity: activity)
      expect([ActivitySession.find(previous_final_score.id).is_final_score, ActivitySession.find(new_activity_session.id).is_final_score]).to eq([true, false])
    end

    it 'mark finished anonymous sessions as final' do
      new_activity_session = create(:activity_session, completed_at: Time.current, state: 'finished', percentage: 0.5, is_final_score: false, user: nil, classroom_unit: nil, activity: activity)
      expect(new_activity_session.is_final_score).to eq(true)
    end
  end

  describe "#increment_counts" do
    let(:student) { create(:student) }

    context "finished activities" do
      before do
        create(:diagnostic_activity_session, :finished, user: student)
        create(:diagnostic_activity_session, :finished, user: student)
        create(:proofreader_activity_session, :finished, user: student)
      end

      it 'should increment counts' do
        expect(student.completed_activity_count).to be 3
      end
    end

    context "unfinished activities" do
      before do
        create(:diagnostic_activity_session, :started, user: student)
        create(:evidence_activity_session, :started, user: student)
      end

      it 'should NOT increment counts' do
        expect(student.completed_activity_count).to be 0
      end
    end
  end

  describe '#validations' do
    let!(:assigned_student){ create(:student) }
    let!(:unassigned_student){ create(:student) }
    let!(:classroom){ create(:classroom, students: [assigned_student, unassigned_student])}
    let!(:activity){ create(:activity) }
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [assigned_student.id], assign_on_join: false )}

    it 'ensures that the student was correctly assigned' do
      act_sesh = ActivitySession.create(user_id: unassigned_student.id, classroom_unit: classroom_unit)
      expect(act_sesh).not_to be_valid
    end
  end

  describe '#save_concept_results' do
    let(:unit) { create(:unit) }
    let(:concept) { create(:concept) }
    let(:student) { create(:student) }
    let(:activity) { create(:activity) }
    let!(:unit_activity) { create(:unit_activity, activity: activity, unit: unit) }
    let!(:classroom_unit) { create(:classroom_unit, unit: unit, assigned_student_ids: [student.id]) }
    let(:activity_session) { create(:activity_session, classroom_unit_id: classroom_unit.id, user_id: student.id, activity: activity) }
    let(:metadata) { { correct: 1 } }

    let(:concept_results) do
      [{
        activity_session_uid: activity_session.uid,
        concept_id: concept.id,
        metadata: metadata,
        question_type: 'lessons-slide'
      }]
    end

    before { activity_session.update(visible: true) }

    it 'should create a concept result with the hash given' do
      expect(OldConceptResult).to receive(:create).with({
        activity_session_id: activity_session.id,
        concept_id: concept.id,
        metadata: metadata,
        question_type: 'lessons-slide'
      })
      ActivitySession.save_concept_results([activity_session], concept_results)
    end
  end

  describe '#delete_activity_sessions_with_no_concept_results' do
    let!(:activity) { create(:activity)}
    let(:classroom_unit) { create(:classroom_unit) }
    let!(:activity_session) { create(:activity_session, activity: activity, classroom_unit: classroom_unit) }
    let!(:activity_session1) { create(:activity_session, activity: activity, classroom_unit: classroom_unit) }

    it 'should delete the activity sessions without the concept results' do
      activity_session.old_concept_results.destroy_all
      expect{ ActivitySession.delete_activity_sessions_with_no_concept_results([activity_session, activity_session1]) }.to change(ActivitySession, :count).by(-1)
    end
  end

  describe '#save_timetracking_data_from_active_activity_session' do
    let!(:activity) { create(:activity)}
    let(:classroom_unit) { create(:classroom_unit) }
    let!(:activity_session) { create(:activity_session, activity: activity, classroom_unit: classroom_unit) }
    let!(:active_activity_session) { create(:active_activity_session, uid: activity_session.uid, data: { 'timeTracking': { 'total': 64691 }})}

    it 'should save the timetracking hash to the data field on the activity session and the total time to the timespent field' do
      ActivitySession.save_timetracking_data_from_active_activity_session([activity_session])
      activity_session.reload
      expect(activity_session.data).to eq({'time_tracking' => { 'total' => 64 }})
      expect(activity_session.timespent).to eq(64)
    end
  end

  describe '#calculate_timespent' do
    let(:time_tracking) {{"1"=>1, "2"=>2, "3"=>3, "4" => 4}}
    let(:time_tracking_with_nulls) { {"1"=>188484, "2"=>94405, "3"=>89076, "4"=>120504, "onboarding"=>nil} }

    it 'should return nil for nil' do
      expect(ActivitySession.calculate_timespent(nil, nil)).to be_nil
    end

    it 'should return nil for a string' do
      expect(ActivitySession.calculate_timespent(nil, 'hello')).to be_nil
    end

    it 'should return timespent of session passed in' do
      session = double(timespent: 100)

      expect(ActivitySession.calculate_timespent(session, time_tracking)).to eq(100)
    end

    it 'should save timetracking data even if one of the values is nil' do
      expect(ActivitySession.calculate_timespent(nil, time_tracking_with_nulls)).to eq(492469)
    end
  end

  describe '#has_a_completed_session?' do
    context 'when session exists' do
      let(:activity_session) { create(:activity_session, state: "finished") }

      it 'should return true' do
        expect(ActivitySession.has_a_completed_session?(activity_session.activity.id, activity_session.classroom_unit.id)).to eq true
      end
    end

    context 'when session does not exist' do
      let(:activity_session) { create(:activity_session, state: 'started') }

      it 'should return false' do
        expect(ActivitySession.has_a_completed_session?(activity_session.activity.id, activity_session.classroom_unit.id)).to eq false
      end
    end
  end

  describe '#mark_all_activity_sessions_complete' do
    let(:activity) { create(:activity) }
    let(:classroom_unit) { create(:classroom_unit) }
    let(:activity_session) { create(:activity_session, classroom_unit: classroom_unit, activity: activity, state: 'started') }

    it 'marks all of a classroom activities activity sessions finished' do
      expect(activity_session.state).not_to eq('finished')
      ActivitySession.mark_all_activity_sessions_complete([activity_session])
      expect(activity_session.reload.state).to eq('finished')
    end
  end

  describe '#has_a_started_session?' do
    context 'when session exists' do
      let(:activity_session) { create(:activity_session, state: "started") }

      it 'should return true' do
        expect(ActivitySession.has_a_started_session?(activity_session.activity.id, activity_session.classroom_unit.id)).to eq true
      end
    end

    context 'when session does not exist' do
      let(:activity_session) { create(:activity_session, state: 'finished') }

      it 'should return false' do
        expect(ActivitySession.has_a_started_session?(activity_session.activity.id, activity_session.classroom_unit.id)).to eq false
      end
    end
  end

  describe '#generate_activity_url' do
    let(:classroom_unit) { create(:classroom_unit) }
    let(:activity) { create(:activity) }

    ENV["DEFAULT_URL"] = 'http://cooolsville.edu'

    it 'returns a url including the default url' do
      expect(ActivitySession.generate_activity_url(classroom_unit.id, activity.id))
        .to include(ENV["DEFAULT_URL"])
    end

    it 'returns a url including the classroom unit id' do
      expect(ActivitySession.generate_activity_url(classroom_unit.id, activity.id))
        .to include("classroom_units/#{classroom_unit.id}")
    end

    it 'returns a url including the activity id' do
      expect(ActivitySession.generate_activity_url(classroom_unit.id, activity.id))
      .to include("activities/#{activity.id}")
    end
  end

  describe '#find_or_create_started_activity_session' do
    let(:student) { create(:student) }
    let(:classroom) { create(:classroom) }
    let(:classroom_unit) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student.id]) }
    let(:activity) { create(:activity) }
    let (:unit_activity) { create(:unit_activity, activity: activity, unit: classroom_unit.unit )}

    it "returns a started activity session if it exists" do
      started_activity_session = create(:activity_session, :started, user: student, activity: activity, classroom_unit: classroom_unit)
      returned_activity_session = ActivitySession.find_or_create_started_activity_session(student.id, classroom_unit.id, activity.id)
      expect(returned_activity_session).to eq(started_activity_session)
    end

    it "returns a started activity session if it exists, even if there are also finished sessions" do
      started_activity_session = create(:activity_session, :started, user: student, activity: activity, classroom_unit: classroom_unit)
      finished_activity_sessions = create_list(:activity_session, 10, state: 'finished', user: student, activity: activity, classroom_unit: classroom_unit)
      returned_activity_session = ActivitySession.find_or_create_started_activity_session(student.id, classroom_unit.id, activity.id)
      expect(returned_activity_session).to eq(started_activity_session)
    end

    it "finds an unstarted activity session if it exists, updates it to started, and returns it" do
      unstarted_activity_session = create(:activity_session, :unstarted, user: student, activity: activity, classroom_unit: classroom_unit)
      returned_activity_session = ActivitySession.find_or_create_started_activity_session(student.id, classroom_unit.id, activity.id)
      expect(returned_activity_session).to eq(unstarted_activity_session)
      expect(returned_activity_session.state).to eq('started')
    end

    it "finds an unstarted activity session if it exists, updates it to started, and returns it, even if there are also finished sessions" do
      unstarted_activity_session = create(:activity_session, :unstarted, user: student, activity: activity, classroom_unit: classroom_unit)
      finished_activity_sessions = create_list(:activity_session, 10, state: 'finished', user: student, activity: activity, classroom_unit: classroom_unit)
      returned_activity_session = ActivitySession.find_or_create_started_activity_session(student.id, classroom_unit.id, activity.id)
      expect(returned_activity_session).to eq(unstarted_activity_session)
      expect(returned_activity_session.state).to eq('started')
    end

    it "creates a started activity session if neither a started nor an unstarted one exist" do
      returned_activity_session = ActivitySession.find_or_create_started_activity_session(student.id, classroom_unit.id, activity.id)
      expect(returned_activity_session.user_id).to eq(student.id)
      expect(returned_activity_session.state).to eq('started')
    end
  end

  describe "#minutes_to_complete" do
    it "should return minutes between completed_at and started_at" do
      now = Time.current
      activity_session = create(:activity_session, started_at: now, completed_at: now + (1 * 60))
      expect(activity_session.minutes_to_complete).to eq(1)
    end

    it "should return nil if completed_at is nil" do
      activity_session = create(:activity_session, completed_at: nil)
      expect(activity_session.minutes_to_complete).to be_nil
    end

    it "should return nil if started_at is nil" do
      activity_session = create(:activity_session, started_at: nil)
      expect(activity_session.minutes_to_complete).to be_nil
    end
  end

  describe "#timespent" do
    it "should be nil for sessions with no timetracking data" do
      activity_session = build(:activity_session)
      expect(activity_session.timespent).to be_nil
    end

    it "should calculate time using the values of the keys in the data['time_tracking'] hash" do
      activity_session = build(:activity_session, data: {"time_tracking"=>{"so"=>9, "but"=>2, "because"=>9, "reading"=>1}})
      expect(activity_session.timespent).to eq(21)
    end

    it "should have calculation overridden by DB value" do
      activity_session = build(:activity_session, state: 'finished', data: {"time_tracking"=>{"so"=>9, "but"=>2, "because"=>9, "reading"=>1}}, timespent: 99)
      expect(activity_session.timespent).to eq(99)
    end
  end


  describe "#teacher_activity_feed" do
    let(:activity_session) { create(:activity_session, :unstarted) }
    let(:teacher) {activity_session.teachers.first}

    it "should create a teacher_activity_feed item only ONCE on completed." do
      teacher_feed = TeacherActivityFeed.get(teacher.id)

      expect(teacher_feed.size).to eq(0)

      activity_session.update(completed_at: Time.current)

      teacher_feed = TeacherActivityFeed.get(teacher.id)

      expect(teacher_feed.size).to eq(1)
      expect(teacher_feed.first[:id]).to eq(activity_session.id)

      activity_session.update(percentage: 0.88)

      teacher_feed = TeacherActivityFeed.get(teacher.id)

      # another update shouldn't add another record
      expect(teacher_feed.size).to eq(1)
    end
  end
end
