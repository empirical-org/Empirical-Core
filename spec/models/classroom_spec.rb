require 'rails_helper'

describe Classroom, type: :model do

  let(:classroom) { build(:classroom) }
  let(:teacher) { create(:teacher)}

  context "when created" do
    it 'must be valid with valid info' do
    	expect(classroom).to be_valid
    end
  end

  context 'validations' do

    it 'must have a name' do
      classroom = build(:classroom, name: nil)
      expect(classroom.save).to be(false)
    end

    it "must generate a valid code" do
      classroom = create(:classroom)
      expect(classroom.code).not_to be_empty
    end

    it "must have a unique name" do
      pending("need to reflect and handle non-unique class name specs")
      other_classroom = build(:classroom, teacher_id: classroom.teacher_id, name: classroom.name)
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
