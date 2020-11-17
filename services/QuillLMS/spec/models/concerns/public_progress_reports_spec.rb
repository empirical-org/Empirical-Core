require 'rails_helper'

describe PublicProgressReports, type: :model do
  before(:each) do
    class FakeReports
      attr_accessor :session
      include PublicProgressReports
    end
  end

  describe '#results_for_classroom' do
    let!(:classroom) { create(:classroom) }
    let!(:activity) { create(:activity) }
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, assign_on_join: true) }
    let!(:students_classrooms1) { create(:students_classrooms, classroom: classroom)}
    let!(:students_classrooms2) { create(:students_classrooms, classroom: classroom)}
    let!(:students_classrooms3) { create(:students_classrooms, classroom: classroom)}
    let!(:activity_session) {create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user: students_classrooms1.student) }
    let!(:unfinished_session) { create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, state: 'started', is_final_score: false, user: students_classrooms2.student) }

    it 'fill report' do
      report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

      expect(report[:students].count).to be 1
      expect(report[:name]).to eq(classroom.name)
      expect(report[:not_completed_names].first).to eq(students_classrooms2.student.name)
      expect(report[:missed_names].first).to be nil
    end

    describe "completed activities" do
      before(:each) do
        unit_activity = UnitActivity.where(activity: activity, unit: classroom_unit.unit).first
        create(:classroom_unit_activity_state, completed: true, classroom_unit: classroom_unit, unit_activity: unit_activity)
      end

      it 'should fill report and mark names as missing' do
        report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

        expect(report[:students].count).to be 1
        expect(report[:name]).to eq(classroom.name)
        expect(report[:missed_names].first).to eq(students_classrooms2.student.name)
      end
    end
  end

  describe "#classrooms_with_students_for_report" do
    let!(:teacher) { create(:teacher) }
    let!(:unit) { create(:unit, user: teacher) }
    let!(:classroom_1) { create(:classroom_with_a_couple_students) }
    let!(:classroom_teacher_1) { create(:classrooms_teacher, classroom: classroom_1, user: teacher) }
    let!(:classroom_2) { create(:classroom_with_a_couple_students) }
    let!(:classroom_teacher_2) { create(:classrooms_teacher, classroom: classroom_2, user: teacher) }
    let!(:classroom_unit_1) { create(:classroom_unit, classroom: classroom_1, unit: unit)}
    let!(:classroom_unit_2) { create(:classroom_unit, classroom: classroom_2, unit: unit)}

    context "no students have completed the activity" do
      describe "it is a diagnostic activity" do
        let!(:diagnostic) { create(:diagnostic) }
        let!(:diagnostic_activity) { create(:diagnostic_activity) }
        let!(:unit_activity) { create(:unit_activity, activity: diagnostic_activity, unit: unit)}

        it "should return an array of classrooms that have been assigned the activity" do
          instance = FakeReports.new
          instance.session = { user_id: teacher.id }
          classrooms = instance.classrooms_with_students_for_report(unit.id, diagnostic_activity.id)
          expect(classrooms[0]['id']).to eq(classroom_1.id)
          expect(classrooms[1]['id']).to eq(classroom_2.id)
          expect(classrooms[0][:classroom_unit_id]).to eq(classroom_unit_1.id)
          expect(classrooms[1][:classroom_unit_id]).to eq(classroom_unit_2.id)
        end
      end
    end
  end

  describe "#generate_recommendations_for_classroom" do
    let!(:unit) { create(:unit) }
    let!(:classroom) { create(:classroom) }
    let!(:diagnostic) { create(:diagnostic) }
    let!(:diagnostic_activity) { create(:diagnostic_activity) }
    let!(:unit_activity) { create(:unit_activity, activity: diagnostic_activity, unit: unit)}
    let!(:student_not_in_class) { create(:student) }
    let!(:student_1) { create(:student) }
    let!(:student_2) { create(:student) }
    let!(:student_3) { create(:student) }
    let!(:students_classrooms_1) { create(:students_classrooms, classroom: classroom, student: student_1)}
    let!(:students_classrooms_2) { create(:students_classrooms, classroom: classroom, student: student_2)}
    let!(:students_classrooms_3) { create(:students_classrooms, classroom: classroom, student: student_3)}
    let!(:classroom_unit_1) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: [student_1.id, student_2.id] )}

    it 'will only return students who are in the class and have their ids in the assigned array' do
      instance = FakeReports.new
      recommendations = instance.generate_recommendations_for_classroom(unit.id, classroom.id, diagnostic_activity.id)
      expect(recommendations[:students].find { |s| s[:id] == student_1.id}).to be
      expect(recommendations[:students].find { |s| s[:id] == student_2.id}).to be
      expect(recommendations[:students].find { |s| s[:id] == student_3.id}).not_to be
      expect(recommendations[:students].find { |s| s[:id] == student_not_in_class.id}).not_to be
    end
  end

  describe '#generic_questions_for_report' do
    let!(:question_1) { create(:question) }
    let!(:question_2) { create(:question) }
    let!(:question_3) { create(:question) }
    let!(:activity) { create(:activity, data: { 'questions' => [{ 'key' => question_1.uid }, { 'key' => question_2.uid }, { 'key' => question_3.uid }] }) }

    it 'should return an array of question hashes with the relevant information' do
      expected_response = [
        {
          question_id: 1,
          score: nil,
          prompt: question_1.data['prompt'],
          instructions: question_1.data['instructions']
        },
        {
          question_id: 2,
          score: nil,
          prompt: question_2.data['prompt'],
          instructions: question_2.data['instructions']
        },
        {
          question_id: 3,
          score: nil,
          prompt: question_3.data['prompt'],
          instructions: question_3.data['instructions']
        }
      ]

      expect(FakeReports.new.generic_questions_for_report(activity.id).to_json).to eq(expected_response.to_json)

    end
  end
end
