# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Check, type: :module) do
    let(:entry) { 'this is the entry'}
    let(:prompt) { double(id: 123, text: 'some prompt') }
    let(:previous_feedback) { []}
    let(:error) {Evidence::Check::Spelling::BingException}
    let(:error_context) { {entry: entry, prompt_id: prompt.id, prompt_text: prompt.text}}

    context "get_feedback" do
      let(:response) { {key: 'value'} }
      let(:check) {double('check', response: response)}

      it "should return trigger_check's response if there is one" do
        expect(Check).to receive(:find_triggered_check).once.and_return(check)

        feedback = Check.get_feedback(entry, prompt, previous_feedback)

        expect(feedback).to eq(response)
      end

      it "should return fallback response if no trigger check is found" do
        expect(Check).to receive(:find_triggered_check).once.and_return(nil)

        feedback = Check.get_feedback(entry, prompt, previous_feedback)

        expect(feedback).to eq(Check.fallback_feedback)
      end
    end

    context "find_triggered_check" do
      context 'all optimal' do
        it "should return autoML feedback" do
          Evidence::Check::ALL_CHECKS.each do |check_class|
            expect_any_instance_of(check_class).to receive(:run).once
            expect_any_instance_of(check_class).to receive(:optimal?).once.and_return(true)
          end

          feedback = Check.find_triggered_check(entry, prompt, previous_feedback)

          expect(feedback.class).to be(Check::AutoML)
        end
      end

      context "nonoptimal" do
        it "should return suboptimal response and not call later checks" do
          Evidence::Check::ALL_CHECKS.slice(0..2).each do |check_class|
            expect_any_instance_of(check_class).to receive(:run).once
            expect_any_instance_of(check_class).to receive(:optimal?).once.and_return(true)
          end

          non_optimal_check_class = Evidence::Check::ALL_CHECKS.slice(3)

          expect_any_instance_of(non_optimal_check_class).to receive(:run).once
          expect_any_instance_of(non_optimal_check_class).to receive(:optimal?).once.and_return(false)

          Evidence::Check::ALL_CHECKS.slice(4..-1).each do |check_class|
            expect_any_instance_of(check_class).not_to receive(:run)
          end

          feedback = Check.find_triggered_check(entry, prompt, previous_feedback)

          expect(feedback.class).to be(non_optimal_check_class)
        end
      end

      context "API raises error" do
        it "should skip that check and move to the next check" do
          first_check_class = Evidence::Check::ALL_CHECKS.first
          second_check_class = Evidence::Check::ALL_CHECKS.second

          expect(Evidence.error_notifier).to receive(:report).with(error, error_context).once
          expect_any_instance_of(first_check_class).to receive(:run).once.and_raise(error)
          expect_any_instance_of(second_check_class).to receive(:run).once
          expect_any_instance_of(second_check_class).to receive(:optimal?).once.and_return(false)

          Evidence::Check::ALL_CHECKS.slice(2..-1).each do |check_class|
            expect_any_instance_of(check_class).not_to receive(:run)
          end

          feedback = Check.find_triggered_check(entry, prompt, previous_feedback)

          expect(feedback.class).to be(second_check_class)
        end
      end
    end

    context "fallback_feedback" do
      it 'should construct feedback based on an error-type rule if it exists' do
        expect(Evidence.error_notifier).to receive(:report).with(error, error_context).once

        Check::ALL_CHECKS.each do |check_class|
          if check_class == Check::AutoML
            expect_any_instance_of(check_class).to receive(:run).and_raise(error)
          else
            expect_any_instance_of(check_class).to receive(:run)
            expect_any_instance_of(check_class).to receive(:optimal?).and_return(true)
          end
        end
        rule = create(:evidence_rule, rule_type: Rule::TYPE_ERROR, optimal: true)
        feedback = create(:evidence_feedback, rule: rule)

        result = Check.get_feedback(entry, prompt, previous_feedback)

        expect(result[:feedback]).to eq(feedback.text)
        expect(result[:feedback_type]).to eq(rule.rule_type)
        expect(result[:optimal]).to eq(rule.optimal)
      end

      it 'provides constant-based feedback if there is no error-type rule' do
        expect(Evidence.error_notifier).to receive(:report).with(error, error_context).once

        Check::ALL_CHECKS.each do |check_class|
          if check_class == Check::AutoML
            expect_any_instance_of(check_class).to receive(:run).and_raise(error)
          else
            expect_any_instance_of(check_class).to receive(:run)
            expect_any_instance_of(check_class).to receive(:optimal?).and_return(true)
          end
        end
        result = Check.get_feedback(entry, prompt, previous_feedback)

        expect(result).to eq(Check::FALLBACK_RESPONSE)
      end

      it 'provides constant-based feedback if there are multiple error-type rules' do
        Check::ALL_CHECKS.each do |check_class|
          if check_class == Check::AutoML
            expect_any_instance_of(check_class).to receive(:run).and_raise("some error")
          else
            expect_any_instance_of(check_class).to receive(:run)
            expect_any_instance_of(check_class).to receive(:optimal?).and_return(true)
          end
        end
        create(:evidence_rule, rule_type: Rule::TYPE_ERROR)
        create(:evidence_rule, rule_type: Rule::TYPE_ERROR)

        result = Check.get_feedback(entry, prompt, previous_feedback)

        expect(result).to eq(Check::FALLBACK_RESPONSE)
      end
    end

    context 'checks_to_run' do
      it 'should return ALL_CHECKS unmodified if the value is nil' do
        checks = Check.checks_to_run(nil)
        expect(checks).to eq(Check::ALL_CHECKS)
      end

      it 'should return ALL_CHECKS unmodified if the value is empty' do
        checks = Check.checks_to_run([])
        expect(checks).to eq(Check::ALL_CHECKS)
      end

      it 'should return an array containing only specified checks' do
        checks = Check.checks_to_run(['Prefilter', 'Plagiarism'])
        expect(checks).to eq([Check::Prefilter, Check::Plagiarism])
      end

      it 'should raise a NoMatchedFeedbackTypes exception if filters are provided but no matches are generated' do
        expect do
          checks = Check.checks_to_run(['NotARealCheck'])
        end.to raise_error(Check::NoMatchedFeedbackTypesError)
      end
    end
  end
end
