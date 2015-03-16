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
    let(:section_ids) { [@sections[0].id, @sections[1].id] }
    let(:filters) { {} }

    before do
      setup_sections_progress_report
    end

    subject { Section.for_progress_report(teacher, filters).to_a }

    it "retrieves aggregated section data" do
      sections = subject
      expect(sections[0]["section_name"]).to eq(@sections.first.name)
    end

    context 'sections' do
      let(:filters) { {section_id: section_ids} }

      it 'can retrieve sections based on sections' do
        expect(subject.size).to eq(2) # 1 user created for each section
      end
    end

    context 'classrooms' do
      let(:filters) { {classroom_id: @classrooms.first.id} }

      it 'can retrieve sections based on classroom_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty classroom' do
      let(:filters) { {classroom_id: ""} }

      it 'does not filter by classroom' do
        expect(subject.size).to eq(@sections.size)
      end
    end

    context 'units' do
      let(:filters) { {unit_id: @units.first.id} }

      it 'can retrieve sections based on unit_id' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty units' do
      let(:filters) { {unit_id: ""} }

      it 'does not filter by units' do
        expect(subject.size).to eq(@sections.size)
      end
    end

    context 'a set of topics' do
      let(:filters) { {section_id: section_ids, topic_id: @topics.map {|t| t.id} } }

      it 'can retrieve sections based on a set of topics' do
        expect(subject.size).to eq(2)
      end
    end

    context 'a single topic' do
      let(:filters) { {section_id: section_ids, topic_id: @topics.first.id } }

      it 'can retrieve sections based on a single topic' do
        expect(subject.size).to eq(1)
      end
    end

    context 'students' do
      let(:filters) { {student_id: @students.first.id} }

      it 'can retrieve sections based on a student' do
        expect(subject.size).to eq(1)
      end
    end

    context 'empty students' do
      let(:filters) { {student_id: ""} }

      it 'does not filter by students' do
        expect(subject.size).to eq(@sections.size)
      end
    end
	end
end
