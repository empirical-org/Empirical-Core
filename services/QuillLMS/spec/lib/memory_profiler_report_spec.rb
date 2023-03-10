# frozen_string_literal: true

require 'rails_helper'

RSpec.describe MemoryProfilerReport do
  subject { described_class.run(&block) }

  let(:block) { proc { 1 + 1 } }

  it { expect(subject.keys).to eq [:memory_allocated, :objects_allocated, :memory_retained, :objects_retained] }
end
