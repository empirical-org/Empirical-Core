# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::Concepts::Concept do
  include_context 'Concept Progress Report'

  let!(:classroom) {create(:classroom_with_classroom_units)}
  let!(:teacher) { classroom.owner }
  # described_class is an rspec method that references ProgressReports::Concepts::Concept

  subject { described_class.results(teacher, filters).to_a }
  # if you want to see what is going on in subject, you'll need to convert it to JSON

  context 'no filters' do
    let(:filters) { {} }

    it 'can retrieve concepts based on no filters' do
      expect(subject.size).to eq(teacher.classrooms_i_teach.map(&:activity_sessions).flatten.map(&:concept_results).flatten.map(&:concept).uniq.count)
    end

    it 'retrieves the total result count' do
      expect(subject.first.total_result_count).to eq(ConceptResult.where(concept: subject.first.concept_id).count)
    end

    it 'retrieves the correct result count' do
      cr_count = 0
      ConceptResult.where(concept: subject.first.concept_id).pluck(:metadata).each{|cr| cr_count += cr["correct"]}
      expect(subject.first.correct_result_count).to eq(cr_count)
    end

    it 'retrieves the incorrect result count' do
      results = ConceptResult.where(concept: subject.first.concept_id).pluck(:metadata)
      cr_count = 0
      results.each{|cr| cr_count += cr["correct"]}
      incorrect_count = results.count - cr_count
      expect(subject.first.incorrect_result_count).to eq(incorrect_count)
    end

    it 'retrieves the grandparent concept (level 2) name' do
      expect(subject.map(&:level_2_concept_name).compact.uniq.first).to eq(writing_grandparent_concept.name)
    end
  end
end
