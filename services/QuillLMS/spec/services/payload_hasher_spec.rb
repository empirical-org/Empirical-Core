# frozen_string_literal: true

require 'rails_helper'

describe PayloadHasher do
  subject { described_class.run(payload) }

  let(:payload) { ['hello', 'world'] }

  it { expect(subject).to eq('2095312189753de6ad47dfe20cbe97ec') }
end
