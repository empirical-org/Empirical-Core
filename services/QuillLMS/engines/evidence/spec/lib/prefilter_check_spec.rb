require 'rails_helper'

module Evidence
  RSpec.describe(PrefilterCheck) do
    let(:rule_factory_overrides) { {rule_type: 'prefilter', universal: true, optimal: false} }

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

    describe '#feedback_object' do
      violations = [
        { 
          name: 'question_mark', 
          entry: 'A question?', 
          rule_uid: 'f576dadc-7eec-4e27-8c95-7763e6550141'
        },
        { 
          name: 'multiple_sentences', 
          entry: 'Yes. No. Maybe.', 
          rule_uid: '66779e2a-74ed-4099-8704-11983121fee5'
        },
        { 
          name: 'too_short', 
          entry: 'Yes.', 
          rule_uid: '408d4544-5492-46e7-a6b7-3b1ffdd632af'
        },
        { 
          name: 'profane', 
          entry: 'Nero was an ahole', 
          rule_uid: 'fdee458a-f017-4f9a-a7d4-a72d1143abeb'
        },
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
          end
        end
      end

      context 'no violation' do 
        it 'should return default_response' do 
          prefilter_check = Evidence::PrefilterCheck.new('they descided on cheeseburgers.')
          result = prefilter_check.feedback_object
          expect(result).to eq(prefilter_check.default_response)
        end
      end
    end

  end
end
