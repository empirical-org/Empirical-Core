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
    let(:filters) { {} }

	  before do
	  	setup_topics_progress_report
	  end

	  subject { Topic.for_progress_report(teacher, filters).to_a }

	  it "retrieves aggregated topics data" do
	  	topics = subject
	  	expect(topics.size).to eq(@visible_topics.size)
	  	expect(topics[0]["topic_name"]).to eq(@first_grade_topic.name)
	  	expect(topics[0]["topic_id"].to_i).to eq(@first_grade_topic.id)
	  end

	  context "when a classroom filter is provided" do
	    let(:filters) { {section_id: @section.id, classroom_id: @full_classroom.id} }

	  	it "filters by classroom" do
	  		expect(subject.size).to eq(@visible_topics.size)
	  	end
	  end

	  context "classroom filter for an empty classroom" do
	  	let(:filters) { {section_id: @section.id, classroom_id: @empty_classroom.id} }

	  	it "returns no results" do
	  		expect(subject.size).to eq(0)
	  	end
	  end

	  context "classroom filter with no ID" do
    	let(:filters) { {section_id: @section.id, classroom_id: ""} }

	  	it "does not filter by classroom" do
	  		expect(subject.size).to eq(@visible_topics.size)
	  	end
	  end

	  context "when a unit filter is provided" do
    	let(:filters) { {section_id: @section.id, unit_id: @unit1.id} }

	  	it "filters by unit" do
	  		expect(subject.size).to eq(@visible_topics.size)
	  	end
	  end

	  context "when an empty unit filter is provided" do
    	let(:filters) { {section_id: @section.id, unit_id: ""} }

	  	it "does not filter by unit" do
	  		expect(subject.size).to eq(@visible_topics.size)
	  	end
	  end

	  context "when a student filter is provided" do
    	let(:filters) { {section_id: @section.id, student_id: @student3.id} }

	  	it "filters by student" do
	  		# student3 has completed activity sessions for only 1 topic
	  		topics = subject
	  		expect(topics.size).to eq(1)
	  		expect(topics[0]['topic_name']).to eq(@second_grade_topic.name)
	  		expect(topics[0]['students_count']).to eq(1)
	  		expect(topics[0]['proficient_count']).to eq(0)
	  		expect(topics[0]['not_proficient_count']).to eq(1)
	  	end
	  end

	  context "when an empty student filter is provided" do
    	let(:filters) { {section_id: @section.id, student_id: ""} }

	  	it "does not filter by student" do
	  		expect(subject.size).to eq(@visible_topics.size)
	  	end
	  end
	end
end
