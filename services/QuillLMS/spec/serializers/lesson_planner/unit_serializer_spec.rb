# frozen_string_literal: true

require 'rails_helper'

describe LessonPlanner::UnitSerializer, type: :serializer do
  before { Timecop.freeze(Time.utc(2015, 1, 1, 12, 0, 0)) }

  after { Timecop.return }

  it_behaves_like 'serializer' do
    let!(:record_instance) { create(:unit) }
    let!(:expected_serialized_keys) { %w(id name selectedActivities classrooms dueDates) }
    let!(:nested_hash_keys) { %w(dueDates) }
    let!(:neseted_array_keys) { %w(selectedActivities classrooms) }
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

    subject { LessonPlanner::UnitSerializer.new(unit.reload).as_json(root: false) }

    context 'assigned_student_ids = []' do
      it 'has correct classrooms' do
        expect(subject[:classrooms]).to eq(expected_classrooms)
      end
    end

    context 'assigned_student_ids includes student.id' do
      let!(:updated_classroom_unit) { classroom_unit.update(assigned_student_ids: [student.id]) }

      it 'has correct classrooms' do
        expect(subject[:classrooms]).to eq(expected_classrooms)
      end
    end

    it 'has correct selected_activities' do
      expect(subject[:selectedActivities]).to eq [ActivitySerializer.new(activity).as_json(root: false)]
    end

    it 'has correct dueDates' do
      hash = {}
      hash[activity.id] = "#{due_date.month}-#{due_date.day}-#{due_date.year}"
      expect(subject[:dueDates]).to eq(hash)
    end
  end
end
