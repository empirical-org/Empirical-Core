require 'rails_helper'

describe ProgressReports::Standards::Classroom do
  describe "getting classrooms for the progress report" do
    let(:standard_level_ids) { [standard_levels[0].id, standard_levels[1].id] }
    let(:filters) { {} }
    include_context 'StandardLevel Progress Report'
    let(:teacher) {classrooms.first.owner}

    before do
      ClassroomsTeacher.all.each{|ct| ct.update(user: teacher)}
    end

    subject { ProgressReports::Standards::Classroom.new(teacher).results(filters).to_a }

    it "retrieves aggregated classroom data" do
      classrooms = subject
      expect(classrooms[0]["name"]).to eq(classrooms.first.name)
      expect(classrooms[0]["id"]).to eq(classrooms.first.id)
      expect(classrooms[0]["total_student_count"]).to eq(classrooms.first.total_student_count)
      expect(classrooms[0]["proficient_student_count"]).to eq(classrooms.first.proficient_student_count)
      expect(classrooms[0]["not_proficient_student_count"]).to eq(classrooms.first.not_proficient_student_count)
      # expect(classrooms[0]["total_standard_count"]).to eq(classrooms.first.total_standard_count)
    end

    it "retrieves classrooms with no filters" do
      expect(subject.size).to eq(classrooms.size)
    end

    it "ignores classrooms associated belonging to a different teacher (even if they share students with this teacher's classrooms" do
      c = create(:classroom)
      t = c.owner
      s = teacher.students.first
      s.classrooms << c

      expect(subject.size).to eq(classrooms.size)
    end

    context 'standard_levels' do
      let(:filters) { {standard_level_id: standard_level_ids} }

      it 'can retrieve standard_levels based on standard_levels' do
        expect(subject.size).to eq(2) # 1 user created for each standard_level
      end
    end

    context 'classrooms' do
      let(:filters) { {classroom_id: classrooms.first.id} }

      it 'can retrieve standard_levels based on classroom_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty classroom' do
      let(:filters) { {classroom_id: ""} }

      it 'does not filter by classroom' do
        expect(subject.size).to eq(standard_levels.size)
      end
    end

    context 'units' do
      let(:filters) { {unit_id: units.first.id} }

      it 'can retrieve standard_levels based on unit_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty units' do
      let(:filters) { {unit_id: ""} }

      it 'does not filter by units' do
        expect(subject.size).to eq(standard_levels.size)
      end
    end

    context 'a set of standards' do
      let(:filters) { {standard_level_id: standard_level_ids, standard_id: standards.map {|t| t.id} } }

      it 'can retrieve standard_levels based on a set of standards' do
        expect(subject.size).to eq(2)
      end
    end

    context 'a single standard' do
      let(:filters) { {standard_level_id: standard_level_ids, standard_id: standards.first.id } }

      it 'can retrieve standard_levels based on a single standard' do
        expect(subject.size).to eq(1)
      end
    end

    context 'students' do
      let(:filters) { {student_id: students.first.id} }

      it 'can retrieve standard_levels based on a student' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty students' do
      let(:filters) { {student_id: ""} }

      it 'does not filter by students' do
        expect(subject.size).to eq(standard_levels.size)
      end
    end
  end
end
