# frozen_string_literal: true

# == Schema Information
#
# Table name: classrooms
#
#  id                  :integer          not null, primary key
#  code                :string
#  grade               :string
#  grade_level         :integer
#  name                :string
#  synced_name         :string
#  visible             :boolean          default(TRUE), not null
#  created_at          :datetime
#  updated_at          :datetime
#  clever_id           :string
#  google_classroom_id :bigint
#  teacher_id          :integer
#
# Indexes
#
#  index_classrooms_on_clever_id            (clever_id)
#  index_classrooms_on_code                 (code)
#  index_classrooms_on_google_classroom_id  (google_classroom_id)
#  index_classrooms_on_grade                (grade)
#  index_classrooms_on_grade_level          (grade_level)
#  index_classrooms_on_teacher_id           (teacher_id)
#
require 'rails_helper'

describe Classroom, type: :model do

  it { should validate_uniqueness_of(:code) }
  it { should validate_presence_of(:name) }

  it { should have_many(:classroom_units) }
  it { should have_many(:units).through(:classroom_units) }
  it { should have_many(:unit_activities).through(:units) }
  it { should have_many(:activities).through(:unit_activities) }
  it { should have_many(:activity_sessions).through(:classroom_units) }
  #check if the code is correct as assign activities model does not exist
  #it { should have_many(:standard_levels).through(:assign) }
  it { should have_many(:coteacher_classroom_invitations) }
  it { should have_many(:students_classrooms).with_foreign_key('classroom_id').dependent(:destroy).class_name("StudentsClassrooms") }
  it { should have_many(:students).through(:students_classrooms).source(:student).with_foreign_key('classroom_id').inverse_of(:classrooms).class_name("User") }
  it { should have_many(:classrooms_teachers).with_foreign_key('classroom_id') }
  it { should have_many(:teachers).through(:classrooms_teachers).source(:user) }

  it { is_expected.to callback(:hide_appropriate_classroom_units).after(:commit) }

  let(:classroom) { build(:classroom) }
  let(:teacher) { create(:teacher) }

  describe '#destroy' do
    let(:teacher2) { create(:teacher)}
    let(:classroom_to_destroy) { create(:classroom) }
    let!(:classrooms_teacher) { create(:classrooms_teacher, user_id: teacher2.id, classroom_id: classroom_to_destroy.id) }

    let(:unit1) { create(:unit) }
    let!(:classroom_unit1) { create(:classroom_unit, unit_id: unit1.id, classroom_id: classroom_to_destroy.id ) }
    let!(:unrelated_classroom_unit) { create(:classroom_unit) }

    let(:student1) { create(:student) }
    let!(:students_classrooms) { create(:students_classrooms, student_id: student1.id, classroom_id: classroom_to_destroy.id) }
    let!(:unrelated_students_classroom) { create(:students_classrooms) }

    let!(:invite) { create(:coteacher_classroom_invitation, classroom_id: classroom_to_destroy.id) }

    it 'should cascade-destroy foreign key dependent records' do
      expect do
        classroom_to_destroy.destroy
      end
      .to change { Classroom.count }.by(-1)
      .and change { Unit.count }.by(0)
      .and change { ClassroomUnit.count }.by(-1)
      .and change { User.count }.by(0)
      .and change { StudentsClassrooms.count }.by(-1)
      .and change { Activity.count }.by(0)
      .and change { CoteacherClassroomInvitation.count }.by(-1)
      expect(ClassroomsTeacher.where(classroom_id: classroom_to_destroy.id).count).to eq 0
    end
  end

  describe '#create_with_join' do

    context 'when passed valid classrooms data' do
      it "creates a classroom" do
        old_count = Classroom.all.count
        Classroom.create_with_join(classroom.attributes, teacher.id)
        expect(Classroom.all.count).to eq(old_count + 1)
      end

      it "creates a ClassroomsTeacher" do
        old_count = ClassroomsTeacher.all.count
        Classroom.create_with_join(classroom.attributes, teacher.id)
        expect(ClassroomsTeacher.all.count).to eq(old_count + 1)
      end

      it "makes the classroom teacher an owner if no third argument is passed" do
        old_count = ClassroomsTeacher.all.count
        Classroom.create_with_join(classroom.attributes, teacher.id)
        expect(ClassroomsTeacher.all.count).to eq(old_count + 1)
        expect(ClassroomsTeacher.last.role).to eq('owner')
      end
    end

    context 'when passed invalid classrooms data' do
      def invalid_classroom_attributes
        attributes = classroom.attributes
        attributes.delete("name")
        attributes
      end
      it "does not create a classroom" do
        old_count = Classroom.all.count
        Classroom.create_with_join(invalid_classroom_attributes, teacher.id)
        expect(Classroom.all.count).to eq(old_count)
      end

      it "does not create a ClassroomsTeacher" do
        old_count = ClassroomsTeacher.all.count
        Classroom.create_with_join(invalid_classroom_attributes, teacher.id)
        expect(ClassroomsTeacher.all.count).to eq(old_count)
      end

    end

  end

  describe '#coteachers' do
    let(:classroom) { build_stubbed(:classroom) }
    let(:teacher) { double(:teacher) }
    let(:user) { double(:user, teacher: teacher) }
    let(:students) { double(:students, where: [user]) }
    let(:classrooms_teachers) { double(:classrooms_teachers, includes: students) }

    before do
      allow(classroom).to receive(:classrooms_teachers).and_return(classrooms_teachers)
    end

    it 'should return the teachers' do
      expect(classroom.coteachers).to include(teacher)
    end
  end

  describe '#unique_standard_count' do
    let(:classroom) { create(:classroom) }
    let(:activity_session) { double(:activity_session, standard_count: 10) }

    context 'when unique standard count array exists' do
      before do
        allow(classroom).to receive(:unique_standard_count_array).and_return([activity_session])
      end

      it 'should return the standard count for the first memeber of the array' do
        expect(classroom.unique_standard_count).to eq(10)
      end
    end

    context 'when unique standard count array does not exist' do
      before do
        allow(classroom).to receive(:unique_standard_count_array).and_return([])
      end

      it 'should return the standard count for the first memeber of the array' do
        expect(classroom.unique_standard_count).to eq(nil)
      end
    end
  end

  describe '#unique_standard_count_array' do
    let(:classroom) { create(:classroom) }

    before do
      allow(ProgressReports::Standards::ActivitySession).to receive(:new).and_call_original
    end

    it 'should create a activity session progress report' do
      expect(ProgressReports::Standards::ActivitySession).to receive(:new).with(classroom.owner)
      classroom.unique_standard_count_array
    end
  end

  describe '#archived_classrooms_manager' do
    let(:classroom) { create(:classroom) }

    before do
      allow(classroom).to receive(:coteachers).and_return([])
    end

    it 'should return the correct hash' do
      expect(classroom.archived_classrooms_manager).to eq({
        createdDate: classroom.created_at.strftime("%m/%d/%Y"),
        className: classroom.name,
        id: classroom.id,
        studentCount: classroom.students.count,
        classcode: classroom.code,
        ownerName: classroom.owner.name,
        from_google: !!classroom.google_classroom_id,
        coteachers: []
        })
    end
  end

  describe '#hide_appropriate_classroom_units' do
    let(:classroom) { create(:classroom) }

    it 'should call hide_all_classroom_units if classroom not visible' do
      classroom.visible = false
      expect(classroom).to receive(:hide_all_classroom_units)
      classroom.hide_appropriate_classroom_units
    end

    it 'should not do anything if classroom visible' do
      classroom.visible = true
      expect(classroom).to_not receive(:hide_all_classroom_units)
      classroom.hide_appropriate_classroom_units
    end
  end

  describe '#with_student_ids' do
    let(:classroom) { create(:classroom) }

    it 'should return the attributes with student ids' do
      expect(classroom.with_students_ids).to eq(classroom.attributes.merge({student_ids: classroom.students.ids}))
    end
  end

  describe '#with_students' do
    let(:classroom) { create(:classroom) }

    it 'should return the attributes with the students' do
      expect(classroom.with_students).to eq(classroom.attributes.merge({students: classroom.students}))
    end
  end

  describe "#generate_code" do
    it "must not run before validate" do
      expect(classroom.code).to be_nil
    end

    it "must generate a code after validations" do
      classroom=create(:classroom)
      expect(classroom.code).to_not be_nil
    end

    it "does not generate a code twice" do
      classroom = create(:classroom)
      old_code = classroom.code
      classroom.update(name: 'Testy Westy')
      expect(classroom.code).to eq(old_code)
    end
  end

  describe 'callbacks' do
    it 'should trigger_analytics_events_for_classroom_creation on create commit' do
      expect{ create(:classroom).run_callbacks(:commit) }.to change(ClassroomCreationWorker.jobs, :size).by 1
    end

    it 'should find or create checkbox' do
      classroom = build(:classroom)
      expect(classroom).to receive(:find_or_create_checkbox)
      classroom.classrooms_teachers.build(user_id: teacher.id, role: 'owner')
      classroom.save
    end
  end

  describe '#units_json' do
    let(:classroom) { create(:classroom) }
    let(:unit1) { create(:unit) }

    it 'should find visible classroom_units' do
      classroom_unit_visible = create(:classroom_unit, classroom: classroom, unit: unit1, visible: true)
      result = classroom.units_json
      expect(result.length).to eq(1)
    end

    it 'should not find hidden classroom_units' do
      classroom_unit_hidden = create(:classroom_unit, classroom: classroom, unit: unit1, visible: false)
      result = classroom.units_json
      expect(result.length).to eq(0)
    end
  end

  describe '#grade_as_integer' do
    it 'should return the grade if it is an integer' do
      classroom = create(:classroom, grade: 1)
      expect(classroom.grade_as_integer).to eq(1)
    end

    it 'should convert the grade if it can be converted' do
      classroom = create(:classroom, grade: 'University')
      expect(classroom.grade_as_integer).to eq(13)
    end

    it 'should return nil if the grade cannot be converted' do
      classroom = create(:classroom, grade: 'Other')
      expect(classroom.grade_as_integer).to eq(-1)

      classroom = create(:classroom, grade: nil)
      expect(classroom.grade_as_integer).to eq(-1)
    end

  end

  describe '#reset_teacher_activity_feed' do
    it 'should trigger a reset of the feed for the owner teacher' do
      classroom.save
      create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom.id, role: 'owner')

      expect(TeacherActivityFeedRefillWorker).to receive(:perform_async).with(teacher.id).once

      classroom.visible = false
      classroom.save
    end

    it 'should trigger a reset of the feed for any coteachers' do
      classroom.save
      create(:classrooms_teacher, user_id: teacher.id, classroom_id: classroom.id, role: 'coteacher')

      expect(TeacherActivityFeedRefillWorker).to receive(:perform_async).with(teacher.id).once

      classroom.visible = false
      classroom.save
    end

    it 'should be called when a classroom goes from visible to invisible' do
      classroom.visible = true
      classroom.save

      expect(classroom).to receive(:reset_teacher_activity_feed).once

      classroom.visible = false
      classroom.save
    end

    it 'should be called when a classroom goes from invisible to visible' do
      classroom.visible = false
      classroom.save

      expect(classroom).to receive(:reset_teacher_activity_feed).once

      classroom.visible = true
      classroom.save
    end

    it 'should not be called on classroom creation' do
      expect(classroom).not_to receive(:reset_teacher_activity_feed)

      classroom.save
    end
  end

end
