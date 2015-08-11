require 'rails_helper'

describe ProgressReports::Concepts::Concept do
  include_context 'Concept Progress Report'

  let!(:teacher) { FactoryGirl.create(:teacher) }
  subject { described_class.results(teacher, filters).to_a }

  context 'no filters' do
    let(:filters) { {} }

    it 'can retrieve concepts based on no filters' do
      expect(subject.size).to eq(activity_session.concepts.size)
    end
  end
end