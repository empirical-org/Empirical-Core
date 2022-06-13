# frozen_string_literal: true

require 'rails_helper'

describe LessonPlanner::UnitSerializer, type: :serializer do
  before do
    Timecop.freeze(Time.utc(2015, 1, 1, 12, 0, 0))
  end

  after do
    Timecop.return
  end

  it_behaves_like 'serializer' do
    let!(:record_instance) { create(:unit) }

    let!(:expected_serialized_keys) do
      %w(id
         name
         selectedActivities
         classrooms
         dueDates)
    end

    let!(:nested_hash_keys) do
      %w(dueDates)
    end

    let!(:neseted_array_keys) do
      %w(selectedActivities
         classrooms)
    end
  end

  context 'unit with nontrivial data' do
    let(:classroom) { create(:classroom_with_one_student) }
    let(:teacher) { classroom.owner }
    let(:student) {classroom.students.first}
    let(:activity) { create(:activity) }
    let(:due_date) { Date.current }
    let(:unit) { create(:unit) }
    let!(:classroom_unit) do
      create(:classroom_unit,
        classroom: classroom,
        assigned_student_ids: [],
        unit: unit,
      )
    end
    let!(:unit_activity) do
      create(:unit_activity,
        unit: unit,
        activity: activity,
        due_date: due_date,
        visible: true
      )
    end
    let!(:expected_classrooms) do
      [
        {
          classroom: classroom,
          students: [
            {
              id: student.id,
              name: student.name,
              isSelected: true
            }
          ]
        }
      ]
    end

    subject do
      LessonPlanner::UnitSerializer.new(unit.reload, root: false).as_json
    end

    context 'assigned_student_ids = []' do
      it 'has correct classrooms' do
        expect(subject[:classrooms]).to eq(expected_classrooms)
      end
    end

    context 'assigned_student_ids includes student.id' do
      let!(:updated_classroom_unit) do
        classroom_unit.update(assigned_student_ids: [student.id])
      end

      it 'has correct classrooms' do
        expect(subject[:classrooms]).to eq(expected_classrooms)
      end
    end

    it 'has correct selected_activities' do
      expect(subject[:selectedActivities])
        .to eq([ActivitySerializer.new(activity, root: false).as_json])
    end

    it 'has correct dueDates' do
      hash = {}
      hash[activity.id] = "#{due_date.month}-#{due_date.day}-#{due_date.year}"
      expect(subject[:dueDates]).to eq(hash)
    end
  end
end
