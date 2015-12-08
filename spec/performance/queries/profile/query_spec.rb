require 'rails_helper'
require 'benchmark'

describe 'Profile::Query' do

  include_context "big profile"

  let(:profile_query) { Profile::Query.new }

  def subject
    profile_query.query(student, 20, 20)
  end

  it 'takes less than 1 sec' do
    time = Benchmark.realtime{ subject }
    expect(time).to be < 1
  end


end