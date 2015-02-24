require 'rails_helper'

describe Topic, :type => :model do

	let!(:topic){FactoryGirl.create(:topic, name: "a")}

	context "when the default order is by name" do

		let!(:topic1){FactoryGirl.create(:topic, name: "c")}
		let!(:topic2){FactoryGirl.create(:topic, name: "b")}

		it "must be ordered correctly" do
			expect(Topic.all.map{|x| x.name}).to eq ["a", "b", "c"]
		end
	end

	context "when it's updated/created" do

		it "must be valid with valid info" do
			expect(topic.valid?).to be_truthy
		end

		context "when it runs validations" do
			it "must have a name" do
				topic.name=nil
				topic.valid?
				expect(topic.errors[:name]).to include "can't be blank"
			end

			it "must have a unique name" do
				t=Topic.first
				n=FactoryGirl.build(:topic, name: t.name)
				n.valid?
				expect(n.errors[:name]).to include "has already been taken"
			end

			it "must have a section" do
				topic.section_id=nil
				topic.valid?
				expect(topic.errors[:section]).to include "can't be blank"
			end
		end
	end

	context "retrieving topics for the progress report" do
		include ProgressReportHelper

	  let!(:teacher) { FactoryGirl.create(:teacher) }

	  before do
	  	setup_topics_progress_report
	  end

	  it "retrieves aggregated section data" do
	  	data = Topic.for_progress_report(teacher, @section.id, {})
	  	expect(data[0]["topic_name"]).to eq(@topics.first.name)
	  end

	  context "when a classroom filter is provided" do
	  	it "filters by classroom" do
	  		data = Topic.for_progress_report(teacher, @section.id, {classroom_id: 123})
	  		expect(data.size).to eq(0)
	  		data = Topic.for_progress_report(teacher, @section.id, {classroom_id: @classrooms.first.id})
	  		expect(data.size).to eq(1)
	  	end
	  end

	  context "when an empty classroom filter is provided" do
	  	it "does not filter by classroom" do
	  		data = Topic.for_progress_report(teacher, @section.id, {classroom_id: ""})
	  		expect(data.size).to eq(@topics.size)
	  	end
	  end

	  context "when a unit filter is provided" do
	  	it "filters by unit" do
	  		data = Topic.for_progress_report(teacher, @section.id, {unit_id: @units.first.id})
	  		expect(data.size).to eq(1)
	  		data = Topic.for_progress_report(teacher, @section.id, {unit_id: 123})
	  		expect(data.size).to eq(0)
	  	end
	  end

	  context "when an empty unit filter is provided" do
	  	it "does not filter by unit" do
	  		data = Topic.for_progress_report(teacher, @section.id, {unit_id: ""})
	  		expect(data.size).to eq(@topics.size)
	  	end
	  end

	  context "when a student filter is provided" do
	  	it "filters by student" do
	  		data = Topic.for_progress_report(teacher, @section.id, {student_id: @students.first.id})
	  		expect(data.size).to eq(1)
	  	end
	  end

	  context "when an empty student filter is provided" do
	  	it "does not filter by student" do
	  		data = Topic.for_progress_report(teacher, @section.id, {student_id: ""})
	  		expect(data.size).to eq(@topics.size)
	  	end
	  end
	end
end
