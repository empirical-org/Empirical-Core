require 'rails_helper'
require 'benchmark'

describe 'Profile::Processor' do

  include_context "big profile"

  let(:profile_processor) { Profile::Processor.new }

  def subject
    profile_processor.query(student)
  end

  it 'takes less than 1 sec' do
    time = Benchmark.realtime{ subject }
    expect(time).to be < 1
  end


end