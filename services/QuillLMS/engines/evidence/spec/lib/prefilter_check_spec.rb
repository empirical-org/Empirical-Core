# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(PrefilterCheck) do
    let(:rule_factory_overrides) do
      { rule_type: 'prefilter', universal: true, optimal: false, concept_uid: 'a_concept_uid' }
    end

    describe '#initialize' do
      it 'should retrieve associated Rules' do
        rule = create(:evidence_rule, rule_type: 'prefilter')
        prefilter_check = Evidence::PrefilterCheck.new("entry")
        expect(prefilter_check.prefilter_rules.first).to eq(rule)
      end
    end

    describe '#sentence_count' do
      it 'should enumerate sentences' do
        text = <<~HEREDOC
          Hello world. My name is Mr. Smith. I work for the U.S. Government and I live in the U.S. I live in New York.
        HEREDOC
        expect(Evidence::PrefilterCheck.sentence_count(text)).to eq 4
      end
    end

    describe '#highlights' do
      let!(:profanity_rule) do
        create(:evidence_rule, **rule_factory_overrides, uid: PrefilterCheck::PROFANITY_RULE_UID)
      end

      context 'no profanity' do
        it 'should return []' do
          prefilter_check = Evidence::PrefilterCheck.new("entry")
          expect(prefilter_check.feedback_object[:highlight]).to eq []
        end
      end

      context 'profanity detected' do
        it 'should return a profane highlight' do
          prefilter_check = Evidence::PrefilterCheck.new("nero was an ahole")
          expect(prefilter_check.feedback_object[:highlight]).to eq(
            [
              {
                category: "",
                text: "ahole",
                type: Evidence::Highlight::TYPE_RESPONSE
              }
            ]
          )
        end
      end
    end

    describe '#feedback_object' do
      violations = [
        {
          name: 'question_mark',
          entry: 'A question?',
          rule_uid: PrefilterCheck::QUESTION_MARK_RULE_UID
        },
        {
          name: 'multiple_sentences',
          entry: 'Yes. No. Maybe.',
          rule_uid: PrefilterCheck::MULTIPLE_SENTENCE_RULE_UID
        },
        {
          name: 'too_short',
          entry: 'Yes.',
          rule_uid: PrefilterCheck::MINIMUM_WORD_RULE_UID
        },
        {
          name: 'profane',
          entry: 'Nero was an ahole',
          rule_uid: PrefilterCheck::PROFANITY_RULE_UID
        }
      ]

      violations.each do |violation|
        context "#{violation[:name]} violation" do
          let!("#{violation[:name]}_rule".to_s) do
            create(:evidence_rule, **rule_factory_overrides, uid: violation[:rule_uid])
          end
          let!(:feedback) do
            create(:evidence_feedback, text: "#{violation[:name]} feedback", rule_id: Evidence::Rule.first.id)
          end

          it 'returns a valid response' do
            prefilter_check = Evidence::PrefilterCheck.new(violation[:entry])
            response = prefilter_check.feedback_object
            expect(response[:rule_uid]).to eq violation[:rule_uid]
            expect(response[:optimal]).to eq false
            expect(response[:feedback]).to eq "#{violation[:name]} feedback"
            expect(response[:concept_uid]).to eq rule_factory_overrides[:concept_uid]
          end
        end
      end

      context 'no violation' do
        it 'should return default_response' do
          prefilter_check = Evidence::PrefilterCheck.new('they decided on cheeseburgers.')
          result = prefilter_check.feedback_object
          expect(result).to eq(prefilter_check.default_response)
        end
      end
    end

  end
end
