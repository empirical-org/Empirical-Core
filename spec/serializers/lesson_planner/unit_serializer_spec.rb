require 'rails_helper'

describe LessonPlanner::UnitSerializer, type: :serializer do
  before do
    Timecop.freeze(Time.utc(2015, 1, 1, 12, 0, 0))
  end

  after do
    Timecop.return
  end

  it_behaves_like 'serializer' do
    let!(:record_instance) { FactoryBot.create(:unit) }

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
    let!(:teacher) { FactoryBot.create(:user, role: 'teacher') }
    let!(:classroom) { FactoryBot.create(:classroom, teacher: teacher) }
    let!(:student) { FactoryBot.create(:user, role: 'student', classrooms: [classroom]) }
    let!(:activity) { FactoryBot.create(:activity) }
    let!(:due_date1) { Date.today }
    let!(:unit) { FactoryBot.create(:unit) }
    let!(:classroom_activity) { FactoryBot.create(:classroom_activity,
                                                    classroom: classroom,
                                                    activity: activity,
                                                    assigned_student_ids: [],
                                                    unit: unit,
                                                    due_date: due_date1)}

    let!(:expected_classrooms) do
      hash = {id: student.id, name: student.name, isSelected: true}
      expected_classrooms = [
        {
          classroom: classroom,
          students: [hash]
        }
      ]
    end


    def subject
      LessonPlanner::UnitSerializer.new(unit, root: false).as_json
    end

    context 'assigned_student_ids = []' do
      it 'has correct classrooms' do
        expect(subject[:classrooms]).to eq(expected_classrooms)
      end
    end

    context 'assigned_student_ids includes student.id' do
      let!(:updated_classroom_activity) { classroom_activity.update(assigned_student_ids: [student.id]) }
      it 'has correct classrooms' do
        expect(subject[:classrooms]).to eq(expected_classrooms)
      end
    end

    it 'has correct selected_activities' do
      expect(subject[:selectedActivities]).to eq([ActivitySerializer.new(activity, root: false).as_json])
    end

    it 'has correct dueDates' do
      hash = {}
      hash[activity.id] = due_date1.month.to_s + "-" + due_date1.day.to_s + "-" + due_date1.year.to_s
      expect(subject[:dueDates]).to eq(hash)
    end
  end
end
