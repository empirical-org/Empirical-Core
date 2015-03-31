require 'rails_helper'

describe Classroom, :type => :model do

  let(:classroom) { FactoryGirl.build(:classroom) }

  context "when is created" do
    it 'must be valid with valid info' do
    	expect(classroom).to be_valid
    end
  end

  describe "#units" do
  	describe "#create_next" do
	  	before do
	  		@classroom = FactoryGirl.create(:classroom)
	  	end
	  	it "must generate a valid unit" do
	  		expect(@classroom.units.create_next).to be_an_instance_of(Unit)
	  	end
    end
	end

  context "when is created" do
    before do
      @classroom = FactoryGirl.build(:classroom, name: nil)
    end
    it 'must have a name' do
      expect(@classroom.save).to be(false)
    end
  end

  context "when is created" do
  	before do
  		@classroom = FactoryGirl.create(:classroom)
  	end
  	it "must generate a valid code" do
  		expect(@classroom.code).not_to be_empty
  	end
  end

  context "when is created" do
    before do
      @classroom = FactoryGirl.create(:classroom)
    end
    it "must have a unique name" do
      other_classroom = FactoryGirl.build(:classroom, teacher_id: @classroom.teacher_id, name: @classroom.name)
      other_classroom.save
      expect(other_classroom.errors).to include(:name)
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
      classroom=FactoryGirl.create(:classroom)
      expect(classroom.code).to_not be_nil
    end

    it "does not generate a code twice" do
      classroom = FactoryGirl.create(:classroom)
      old_code = classroom.code
      classroom.update_attributes(name: 'Testy Westy')
      expect(classroom.code).to eq(old_code)
    end
  end

  describe "getting classrooms for the progress report" do
    let!(:teacher) { FactoryGirl.create(:teacher) }
    let(:section_ids) { [sections[0].id, sections[1].id] }
    let(:filters) { {} }
    include_context 'Section Progress Report'

    subject { Classroom.for_standards_report(teacher, filters).to_a }

    it "retrieves aggregated classroom data" do
      classrooms = subject
      expect(classrooms[0]["name"]).to eq(classrooms.first.name)
      expect(classrooms[0]["id"]).to eq(classrooms.first.id)
      expect(classrooms[0]["total_student_count"]).to eq(classrooms.first.total_student_count)
      expect(classrooms[0]["proficient_student_count"]).to eq(classrooms.first.proficient_student_count)
      expect(classrooms[0]["near_proficient_student_count"]).to eq(classrooms.first.near_proficient_student_count)
      expect(classrooms[0]["not_proficient_student_count"]).to eq(classrooms.first.not_proficient_student_count)
      # expect(classrooms[0]["total_standard_count"]).to eq(classrooms.first.total_standard_count)
    end

    it "retrieves classrooms with no filters" do
      expect(subject.size).to eq(classrooms.size)
    end

    context 'sections' do
      let(:filters) { {section_id: section_ids} }

      it 'can retrieve sections based on sections' do
        expect(subject.size).to eq(2) # 1 user created for each section
      end
    end

    context 'classrooms' do
      let(:filters) { {classroom_id: classrooms.first.id} }

      it 'can retrieve sections based on classroom_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty classroom' do
      let(:filters) { {classroom_id: ""} }

      it 'does not filter by classroom' do
        expect(subject.size).to eq(sections.size)
      end
    end

    context 'units' do
      let(:filters) { {unit_id: units.first.id} }

      it 'can retrieve sections based on unit_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty units' do
      let(:filters) { {unit_id: ""} }

      it 'does not filter by units' do
        expect(subject.size).to eq(sections.size)
      end
    end

    context 'a set of topics' do
      let(:filters) { {section_id: section_ids, topic_id: topics.map {|t| t.id} } }

      it 'can retrieve sections based on a set of topics' do
        expect(subject.size).to eq(2)
      end
    end

    context 'a single topic' do
      let(:filters) { {section_id: section_ids, topic_id: topics.first.id } }

      it 'can retrieve sections based on a single topic' do
        expect(subject.size).to eq(1)
      end
    end

    context 'students' do
      let(:filters) { {student_id: students.first.id} }

      it 'can retrieve sections based on a student' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty students' do
      let(:filters) { {student_id: ""} }

      it 'does not filter by students' do
        expect(subject.size).to eq(sections.size)
      end
    end
  end
end
