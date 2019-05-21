require 'rails_helper'

describe StudentsClassrooms, type: :model, redis: :true do
  it { should belong_to(:student).class_name('User') }
  it { should belong_to(:classroom).class_name("Classroom") }

  it { is_expected.to callback(:checkbox).after(:save) }
  it { is_expected.to callback(:run_associator).after(:save) }
  it { is_expected.to callback(:invalidate_classroom_minis).after(:commit) }

  describe '#archived_classrooms_manager' do
    let(:classrooms) { create(:students_classrooms) }

    it 'should return the correct hash' do
      expect(classrooms.archived_classrooms_manager).to eq(
        {
          joinDate: classrooms.created_at.strftime("%m/%d/%Y"),
          className: classrooms.classroom.name,
          teacherName: classrooms.classroom.owner.name,
          id: classrooms.id
        })
    end
  end

  describe 'callbacks' do
    context '#checkbox' do
      let(:students_classrooms) { build(:students_classrooms) }

      it 'should find or create a checkbox' do
        expect(students_classrooms).to receive(:find_or_create_checkbox).with('Add Students', students_classrooms.classroom.owner)
        students_classrooms.save
      end
    end

    context '#run_associator' do
      let(:students_classrooms) { build(:students_classrooms, visible: true) }

      it 'should run the students to classrooms associator' do
        expect(Associators::StudentsToClassrooms).to receive(:run).with(students_classrooms.student, students_classrooms.classroom)
        students_classrooms.save
      end
    end

    context '#archive_student_associations_for_classroom_if_archived' do
      let(:student) { create(:student_in_two_classrooms_with_many_activities) }
      let(:student_classroom) { StudentsClassrooms.find_by(student_id: student.id) }

      it "should remove the student's id from assigned_student_ids array from that classroom's classroom units" do
        student_classroom.update(visible: false)
        classroom_units = ClassroomUnit.where("classroom_id = #{student_classroom.classroom_id} AND #{student.id} = ANY (assigned_student_ids)")
        expect(classroom_units.length).to eq(0)
      end

      it "should archive the student's activity sessions for that classroom's classroom units" do
        student_classroom.update(visible: false)
        classroom_unit_ids = ClassroomUnit.where(classroom_id: student_classroom.classroom_id).ids
        activity_sessions = ActivitySession.where(classroom_unit_id: classroom_unit_ids, user_id: student.id)
        expect(activity_sessions.count).to eq(0)
      end
    end

    context 'invalidate_classroom_minis' do
      let(:classrooms) { create(:students_classrooms) }

      it "should invalidate the classroom minis" do
        $redis.set("user_id:#{classrooms.classroom.owner.id}_classroom_minis", "something")
        classrooms.run_callbacks(:commit)
        expect($redis.get("user_id:#{classrooms.classroom.owner.id}_classroom_minis")).to eq nil
      end
    end
  end
end
