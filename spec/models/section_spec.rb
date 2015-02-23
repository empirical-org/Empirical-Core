require 'rails_helper'

describe Section, type: :model do

	let(:section){ FactoryGirl.build(:section) }

	context "when it's created/updated" do

		it "must be valid with valid info" do
			expect(section).to be_valid
		end

		context "when it runs validations" do

			it "must have a name" do
				section.name=nil
				section.valid?
				expect(section.errors[:name]).to include "can't be blank"
			end
		end
	end

	context "retrieving sections for the progress report" do
	  let!(:teacher) { FactoryGirl.create(:teacher) }

	  before do
	    ActivitySession.destroy_all
	    @sections = []
	    @units = []
	    @classrooms = []
	    @students = []
	    3.times do |i|
	    	student = FactoryGirl.create(:student)
	    	@students << student
	    	classroom = FactoryGirl.create(:classroom, teacher: teacher, students: [student])
	    	@classrooms << classroom
	    	section = FactoryGirl.create(:section)
	    	@sections << section
	    	unit = FactoryGirl.create(:unit)
	    	@units << unit
	      topic = FactoryGirl.create(:topic, section: section)
	      activity = FactoryGirl.create(:activity, topic: topic)
	      classroom_activity = FactoryGirl.create(:classroom_activity,
	                                              classroom: classroom,
	                                              activity: activity,
	                                              unit: unit)
	      3.times do |j|
	        activity_session = FactoryGirl.create(:activity_session,
	                                              classroom_activity: classroom_activity,
	                                              user: student,
	                                              activity: activity,
	                                              state: 'finished',
	                                              percentage: i / 3.0)
	      end
	    end
	  end

	  it "retrieves aggregated section data" do
	  	data = Section.for_progress_report(teacher, {})
	  	expect(data[0]["section_name"]).to eq(@sections.first.name)
	  end

	  context "when a classroom filter is provided" do
	  	it "filters by classroom" do
	  		data = Section.for_progress_report(teacher, {classroom_id: 123})
	  		expect(data.size).to eq(0)
	  		data = Section.for_progress_report(teacher, {classroom_id: @classrooms.first.id})
	  		expect(data.size).to eq(1)
	  	end
	  end

	  context "when an empty classroom filter is provided" do
	  	it "does not filter by classroom" do
	  		data = Section.for_progress_report(teacher, {classroom_id: ""})
	  		expect(data.size).to eq(@sections.size)
	  	end
	  end

	  context "when a unit filter is provided" do
	  	it "filters by unit" do
	  		unit_to_filter = @units.first
	  		data = Section.for_progress_report(teacher, {unit_id: unit_to_filter})
	  		expect(data.size).to eq(1)
	  		data = Section.for_progress_report(teacher, {unit_id: 123})
	  		expect(data.size).to eq(0)
	  	end
	  end

	  context "when an empty unit filter is provided" do
	  	it "does not filter by unit" do
	  		data = Section.for_progress_report(teacher, {unit_id: ""})
	  		expect(data.size).to eq(@sections.size)
	  	end
	  end

	  context "when a student filter is provided" do
	  	it "filters by student" do
	  		data = Section.for_progress_report(teacher, {student_id: @students.first.id})
	  		expect(data.size).to eq(1)
	  	end
	  end

	  context "when an empty student filter is provided" do
	  	it "does not filter by student" do
	  		data = Section.for_progress_report(teacher, {student_id: ""})
	  		expect(data.size).to eq(@sections.size)
	  	end
	  end
	end
end
