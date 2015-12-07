require 'rails_helper'
require 'benchmark'

describe 'Profile::Processor' do

  include_context "big profile"

  let(:profile_processor) { Profile::Processor.new }

  def subject
    profile_processor.query(student, 0)
  end

  it 'takes less than 2 secs' do
    time = Benchmark.realtime{ subject }
    expect(time).to be < 2
  end


end