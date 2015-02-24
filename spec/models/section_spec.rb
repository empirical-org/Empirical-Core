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
		include ProgressReportHelper

	  let!(:teacher) { FactoryGirl.create(:teacher) }

	  before do
	  	setup_sections_progress_report
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
