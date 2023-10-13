# frozen_string_literal: true

require 'rails_helper'

describe PayloadHasher do
  subject { described_class.run(payload) }

  let(:payload) { ['hello', 'world'] }

  it { expect(subject).to eq('2095312189753de6ad47dfe20cbe97ec') }

  context 'with a payload that is shaped like one we expect in production' do
    let(:query) { 'active-classrooms' }
    let(:timeframe_name) { 'last-30-days' }
    let(:school_ids) { [1,2,3] }
    let(:grades) { ['Kindergarten',1,2,3,4] }
    let(:teacher_ids) { [3,4,5] }
    let(:classroom_ids) { [6,7] }

    it do
      expect(PayloadHasher.run([
        query,
        timeframe_name,
        school_ids,
        grades,
        teacher_ids,
        classroom_ids
      ].flatten)).to eq('ddf3864a54d23d58ee4a0b619c8f3ff6')
    end
  end
end
