require 'rails_helper'

describe PublicProgressReports, type: :model do
  describe '#results_for_classroom' do
    let(:classroom) { create(:classroom) }
    let(:activity) { create(:activity) }
    let!(:students_classrooms1) { create(:students_classrooms, classroom: classroom)}
    let!(:students_classrooms2) { create(:students_classrooms, classroom: classroom)}
    let!(:students_classrooms3) { create(:students_classrooms, classroom: classroom)}
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, assign_on_join: true) }
    let!(:activity_session) {create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, user: students_classrooms1.student) }
    let!(:unfinished_session) { create(:activity_session, classroom_unit_id: classroom_unit.id, activity_id: activity.id, state: 'started', is_final_score: false, user: students_classrooms2.student) }

    before(:each) do
      class FakeReports
        include PublicProgressReports
      end
    end

    it 'fill report' do
      report = FakeReports.new.results_for_classroom(classroom_unit.unit_id, activity.id, classroom.id)

      expect(report[:students].count).to be 1
      expect(report[:name]).to eq(classroom.name)
      expect(report[:started_names].first).to eq(students_classrooms2.student.name)
      expect(report[:unstarted_names].first).to eq(students_classrooms3.student.name)
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
        expect(report[:started_names].first).to eq(students_classrooms2.student.name)
        expect(report[:unstarted_names].first).to be nil
        expect(report[:missed_names].first).to eq(students_classrooms3.student.name)
      end
    end
  end
end
