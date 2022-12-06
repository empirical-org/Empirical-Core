# frozen_string_literal: true

require 'rails_helper'

describe Associators::StudentsToClassrooms do
  subject { described_class.run(student, classroom) }

  let!(:student) { create(:student) }
  let!(:classroom) { create(:classroom) }

  context 'race conditions' do
    # While twenty parallel calls does feel a bit excessive, testing locally
    # suggests that that's about the level required to trigger the race
    # condition on 90% of test runs.
    let(:call_count) { 20 }

    it { makes_concurrent_calls_and_not_raise_errors }

    context 'student classroom already exists' do
      before { create(:students_classrooms, classroom: classroom, student: student, visible: visible) }

      context 'is visible' do
        let(:visible) { true }

        it { makes_concurrent_calls_and_not_raise_errors }
      end

      context 'is archived' do
        let(:visible) { false }

        it { makes_concurrent_calls_and_not_raise_errors }
      end
    end

    def makes_concurrent_calls_and_not_raise_errors
      wait_to_start = true

      threads = call_count.times.map do |i|
        Thread.new do |t|
          true while wait_to_start
          subject
        end
      end

      wait_to_start = false

      expect { threads.each(&:join) }.to_not raise_error
    end
  end
end
