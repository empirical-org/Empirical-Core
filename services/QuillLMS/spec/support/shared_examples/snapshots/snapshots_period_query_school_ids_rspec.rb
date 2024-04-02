# frozen_string_literal: true

require 'rails_helper'

RSpec.shared_examples 'snapshots period query with a different school id' do |expected_results|
  let(:school_ids) { [create(:school).id] }

  it { expect(results).to eq expected_results }
end
