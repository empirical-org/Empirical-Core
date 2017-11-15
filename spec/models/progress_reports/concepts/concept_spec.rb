require 'rails_helper'

describe ProgressReports::Concepts::Concept do
  include_context 'Concept Progress Report'

  let!(:teacher) { classroom.owner }
  subject { described_class.results(teacher, filters).to_a }

  context 'no filters' do
    let(:filters) { {} }

    it 'can retrieve concepts based on no filters' do
      expect(subject.size).to eq(activity_session.concepts.size)
    end

    it 'retrieves the total result count' do
      expect(subject.first.total_result_count).to eq(2)
    end

    it 'retrieves the correct result count' do
      expect(subject.first.correct_result_count).to eq(1)
    end

    it 'retrieves the incorrect result count' do
      expect(subject.first.incorrect_result_count).to eq(1)
    end

    it 'retrieves the grandparent concept (level 2) name' do
      expect(subject[1].level_2_concept_name).to eq(writing_grandparent_concept.name)
    end
  end
end
