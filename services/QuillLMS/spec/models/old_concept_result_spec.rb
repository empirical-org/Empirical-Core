# frozen_string_literal: true

# == Schema Information
#
# Table name: old_concept_results
#
#  id                         :integer          not null, primary key
#  metadata                   :json
#  question_type              :string
#  activity_classification_id :integer
#  activity_session_id        :integer
#  concept_id                 :integer          not null
#
# Indexes
#
#  index_old_concept_results_on_activity_session_id  (activity_session_id)
#  index_old_concept_results_on_concept_id           (concept_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_classification_id => activity_classifications.id)
#
require 'rails_helper'

describe OldConceptResult, type: :model do

  let(:concept_result) { build(:old_concept_result, concept: nil) }
  let!(:concept) { create(:concept) }
  let(:concept_result_with_concept) { build(:old_concept_result, concept: concept) }

  describe '#concept_uid=' do
    it 'assigns the concept with that UID' do
      concept_result.concept_uid = concept.uid
      expect(concept_result.concept).to eq(concept)
    end
  end

  describe 'question type' do

    it "can be empty" do
      expect(concept_result_with_concept).to be_valid
    end

    it "can equal passage-proofreader" do
      concept_result_with_concept.update(question_type:'passage-proofreader')
      expect(concept_result_with_concept).to be_valid
    end

    it "can equal sentence-writing" do
      concept_result_with_concept.update(question_type:'sentence-writing')
      expect(concept_result_with_concept).to be_valid
    end

    it "can equal sentence-fragment-identification" do
      concept_result_with_concept.update(question_type:'sentence-fragment-identification')
      expect(concept_result_with_concept).to be_valid
    end

    it "can equal sentence-fragment-expansion" do
      concept_result_with_concept.update(question_type:'sentence-fragment-expansion')
      expect(concept_result_with_concept).to be_valid
    end

    it "can equal sentence-combining" do
      concept_result_with_concept.update(question_type:'sentence-combining')
      expect(concept_result_with_concept).to be_valid
    end

    it "can equal nil" do
      concept_result_with_concept.update(question_type: nil)
      expect(concept_result_with_concept).to be_valid
    end

    it "cannot equal anything else" do
      concept_result_with_concept.update(question_type: 'sunglasses')
      expect(concept_result_with_concept).to_not be_valid
    end

  end

end
