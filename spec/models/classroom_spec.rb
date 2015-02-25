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
      expect(other_classroom.errors[:name]).to include("A classroom called #{@classroom.name} already exists. Please rename this classroom to a different name.")
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
    include ProgressReportHelper

    let!(:teacher) { FactoryGirl.create(:teacher) }
    let(:section_ids) { [@sections[0].id, @sections[1].id] }

    before do
      setup_sections_progress_report
    end

    it 'can retrieve classrooms based on sections' do
      classrooms = Classroom.for_progress_report(teacher, {section_id: section_ids})
      expect(classrooms.size).to eq(2) # 1 classroom created for each section
    end

    it 'can retrieve classrooms based on student_id' do
      classrooms = Classroom.for_progress_report(teacher, {student_id: @students.first.id})
      expect(classrooms.size).to eq(1)
    end

    it 'can retrieve classrooms based on unit_id' do
      classrooms = Classroom.for_progress_report(teacher, {unit_id: @units.first.id})
      expect(classrooms.size).to eq(1)
    end

    it 'can retrieve classrooms based on a set of topic ids' do
      classrooms = Classroom.for_progress_report(teacher, {topic_id: @topics.first.id})
      expect(classrooms.size).to eq(1)
    end

    it 'can retrieve classrooms based on no additional parameters' do
      classrooms = Classroom.for_progress_report(teacher, {})
      expect(classrooms.size).to eq(@classrooms.size)
    end
  end
end
