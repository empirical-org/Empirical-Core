require 'rails_helper'

describe Classroom, type: :model do

  let(:classroom) { build(:classroom) }
  let(:teacher) { create(:teacher)}

  # context "when created" do
  #   it 'must be valid with valid info' do
  #   	expect(classroom).to be_valid
  #   end
  # end
  #
  # context 'validations' do
  #   it 'must have a name' do
  #     classroom = build(:classroom, name: nil)
  #     expect(classroom.save).to be(false)
  #   end
  #
  #   it "must generate a valid code" do
  #     classroom = create(:classroom)
  #     expect(classroom.code).not_to be_empty
  #   end
  #
  #   it "must have a unique name" do
  #     pending("need to reflect and handle non-unique class name specs")
  #     other_classroom = build(:classroom, teacher_id: classroom.teacher_id, name: classroom.name)
  #     other_classroom.save
  #     expect(other_classroom.errors).to include(:name)
  #   end
  # end

  describe "relations with teachers" do
    let!(:classroom) { create(:classroom) }
    let!(:classroom_with_no_teacher) {create(:classroom, :with_no_teacher)}
    let!(:classroom_with_a_couple_coteachers) {create(:classroom, :with_a_couple_coteachers)}
    # context "#classrooms_teachers" do
    #   it "returns an array of classrooms_teacher objects if there are any" do
    #     byebug
    #     expect(classroom.classrooms_teachers.length).to eq(1)
    #   end
    #   it "returns an empty array if there are no associated classrooms_teachers" do
    #     expect(classroom_with_no_teacher.classrooms_teachers).to eq([])
    #   end
    # end

    context "#owner" do
      it "returns the user who owns the classroom" do
        expect(classroom.owner).to eq(ClassroomsTeacher.find_by_role_and_classroom_id('owner', classroom.id).teacher)
      end
    end

    context "#coteachers" do
      let!(:classroom_with_coteacher) {create(:classroom, :with_coteacher)}
      it "returns all users who coteach the classroom (but do not own it)" do
        single_coteacher_arr = [ClassroomsTeacher.find_by(classroom: classroom_with_coteacher, role: 'coteacher').teacher]
        expect(classroom_with_coteacher.coteachers).to eq(single_coteacher_arr)
        couple_coteacher_arr = ClassroomsTeacher.where(classroom: classroom_with_a_couple_coteachers, role: 'coteacher').map(&:teacher).flatten
        expect(classroom_with_a_couple_coteachers.coteachers).to eq(couple_coteacher_arr)
      end
    end

    context "#teachers" do
      it "returns all users who teach the class (as owners or coteachers)" do
        classroom_teachers = ClassroomsTeacher.where(classroom: classroom_with_a_couple_coteachers).map(&:teacher)
        expect(classroom_with_a_couple_coteachers.teachers).to eq(classroom_teachers)
      end
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




  describe "#classroom_activity_for" do
    before do
      @activity=Activity.create!()
    end

  	it "returns nil when none associated" do
  		expect(classroom.classroom_activity_for(@activity)).to be_nil
  	end

    it "returns a classroom activity when it's associated" do
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
      classroom.update_attributes(name: 'Testy Westy')
      expect(classroom.code).to eq(old_code)
    end
  end

end
