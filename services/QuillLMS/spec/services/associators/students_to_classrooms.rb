# frozen_string_literal: true

require 'rails_helper'

describe Associators::StudentsToClassrooms do
  let(:subject) { described_class }

  let!(:user) { create(:user, role: User::STUDENT) }
  let!(:classroom) { create(:classroom) }

  it 'should handle a race condition where two simultaneous calls go down the init side of a find_or_initialize_by call' do
    # While twenty parallel calls does feel a bit excessive, testing locally
    # suggests that that's about the level required to trigger the race
    # condition on 90% of test runs.
    call_count = 20
    wait_to_start = true

    threads = call_count.times.map do |i|
      Thread.new do
        true while wait_to_start
        subject.run(user, classroom)
      end
    end
    wait_to_start = false
    expect { threads.each(&:join) }.to_not raise_error
  end
end
