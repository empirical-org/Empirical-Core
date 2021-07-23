require 'rails_helper'

module Comprehension
  RSpec.describe(PlagiarismCheck, :type => :model) do
    let!(:rule) { create(:comprehension_rule, :rule_type => "plagiarism") } 

    context 'should #feedback_object' do

      it 'should return appropriate feedback attributes if there is plagiarism' do
        $redis.redis.flushdb
        entry = "these are s'',ome! r''esponse words to plagiarize and this is plagiarism"
        passage = "these are some res,,,,ponse,,,, words to plagiarize and this is plagiarism"
        feedback = "this is some standard plagiarism feedback"
        plagiarism_check = Comprehension::PlagiarismCheck.new(entry, passage, feedback, rule)
        feedback = plagiarism_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_falsey)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
        expect(feedback[:highlight][0][:text]).to(be_truthy)
        expect(feedback[:highlight][1][:text]).to(be_truthy)
      end

      it 'should return appropriate feedback when there is no plagiarism' do
        entry = "these are some response words to plagiarize"
        passage = "it is always bad to plagiarize"
        feedback = "this is some standard plagiarism feedback"
        optimal_rule = create(:comprehension_rule, :rule_type => "plagiarism", :optimal => true)
        plagiarism_check = Comprehension::PlagiarismCheck.new(entry, passage, feedback, rule)
        feedback = plagiarism_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_truthy)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
      end

      it 'should not be plagiarized if the plagiarism word phrase is under the match minimum' do
        entry = "these are some response words to plagiarize"
        passage = "it is always bad to plagiarize"
        feedback = "it is always bad to plagiarize"
        optimal_rule = create(:comprehension_rule, :rule_type => "plagiarism", :optimal => true)
        plagiarism_check = Comprehension::PlagiarismCheck.new(entry, passage, feedback, rule)
        feedback = plagiarism_check.feedback_object
        expect(feedback[:feedback]).to(be_truthy)
        expect(feedback[:feedback_type]).to(be_truthy)
        expect(feedback[:optimal]).to(be_truthy)
        expect(feedback[:entry]).to(be_truthy)
        expect(feedback[:rule_uid]).to(be_truthy)
        expect(feedback[:concept_uid]).to(be_truthy)
      end
    end
  end
end
