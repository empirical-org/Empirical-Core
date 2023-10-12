# frozen_string_literal: true

require 'rails_helper'

describe PayloadHasher do
  subject { described_class.run(payload) }

  let(:payload) { ['hello', 'world'] }

  it { expect(subject).to eq('afa27b44d43b02a9fea41d13cedc2e4016cfcf87c5dbf990e593669aa8ce286d') }
end
