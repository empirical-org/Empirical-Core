# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Check, type: :module) do

    context "run_all" do
      let(:entry) { 'this is the entry'}
      let(:prompt) {'some prompt'}
      let(:previous_feedback) { []}

      context 'all optimal' do
        it "should return autoML feedback" do
          Evidence::Check::ALL_CHECKS.each do |check_class|
            expect_any_instance_of(check_class).to receive(:run).once
            expect_any_instance_of(check_class).to receive(:optimal?).once.and_return(true)
          end

          feedback = Check.run_all(entry, prompt, previous_feedback)

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

          feedback = Check.run_all(entry, prompt, previous_feedback)

          expect(feedback.class).to be(non_optimal_check_class)
        end
      end

      context "API raises error" do
        it "should skip that check and move to the next check" do
          first_check_class = Evidence::Check::ALL_CHECKS.first
          second_check_class = Evidence::Check::ALL_CHECKS.second

          expect_any_instance_of(first_check_class).to receive(:run).once.and_raise("some error")
          expect_any_instance_of(second_check_class).to receive(:run).once
          expect_any_instance_of(second_check_class).to receive(:optimal?).once.and_return(false)

          Evidence::Check::ALL_CHECKS.slice(2..-1).each do |check_class|
            expect_any_instance_of(check_class).not_to receive(:run)
          end

          feedback = Check.run_all(entry, prompt, previous_feedback)

          expect(feedback.class).to be(second_check_class)
        end
      end
    end
  end
end
