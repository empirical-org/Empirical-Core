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

end
