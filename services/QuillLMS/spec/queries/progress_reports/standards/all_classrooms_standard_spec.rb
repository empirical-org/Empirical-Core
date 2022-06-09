# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::Standards::AllClassroomsStandard do
  describe '#results' do
    let!(:teacher1) { create(:teacher, :with_classrooms_students_and_activities) }

    let!(:sample_student_data) do
      classroom_unit = ClassroomUnit.last
      {
        student: User.find(classroom_unit.assigned_student_ids.first),
        classroom_unit: classroom_unit
      }
    end

    let!(:activity_session_non_evidence) do
      create(:activity_session, user: sample_student_data[:student], classroom_unit: sample_student_data[:classroom_unit])
    end

    it 'should return the correctly shaped payload' do
      expected_keys =  [
        'id',
        'name',
        'standard_level_name',
        'total_activity_count',
        'total_student_count',
        'proficient_count',
        'timespent',
        'is_evidence'
      ]
      result = ProgressReports::Standards::AllClassroomsStandard.new(teacher1)
      .results(sample_student_data[:classroom_unit].classroom_id, nil)
      expect(result.first.keys).to eq expected_keys
    end

    context 'without evidence activity' do
      it 'should indicate evidence activities via the is_evidence property' do
        result = ProgressReports::Standards::AllClassroomsStandard.new(teacher1)
        .results(sample_student_data[:classroom_unit].classroom_id, nil)
        expect(result.first['is_evidence']).to eq false
      end
    end

    context 'with evidence activity' do
      let(:evidence_standard_category) do
        create(:standard_category, id: ::Constants::EVIDENCE_STANDARD_CATEGORY)
      end
      let!(:evidence_standard) { create(:standard, standard_category: evidence_standard_category) }
      let!(:evidence_activity) { create(:activity, standard: evidence_standard)}
      let!(:activity_session_evidence) do
        create(
          :activity_session,
          user: sample_student_data[:student],
          classroom_unit: sample_student_data[:classroom_unit],
          activity: evidence_activity
        )
      end

      it 'should indicate evidence activities via the is_evidence property' do
        results = ProgressReports::Standards::AllClassroomsStandard.new(teacher1)
        .results(sample_student_data[:classroom_unit].classroom_id, nil)
        result = results.find {|r| r['id'] == evidence_standard.id}
        expect(result['is_evidence']).to eq true
      end
    end
  end

end
