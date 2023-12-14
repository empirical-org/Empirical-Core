# frozen_string_literal: true

require 'rails_helper'

describe QuestionCounter do
  subject { described_class.run(activity) }

  let(:question_list) { [{ key: 'fake_key' }, { key: 'fake_key' }] }
  let(:passage) { "Yuri Gagarin is {+famous-famous,|nb0JW1r5pRB5ouwAzTgMbQ} because he was the first person to travel into outer space and orbit the Earth. He was born on {+March-march|E635Hrr0tuMsBDm7lLfrPg} 9, 1934, in the Soviet Union.<br/><br/><br/>Gagarin first learned to fly a plane when he was young man studying in Saratov. After finishing {+school,-school|m8sKnkzLg1mIAkkXeqHOWw}"}
  let(:default_size) {99}

  context 'blank activity' do
    before do
      stub_const("QuestionCounter::DEFAULT", default_size)
    end
    let(:activity) { nil }

    it { expect(subject).to eq default_size }
  end

  context 'tool default' do
    let(:activity) { create(:connect_activity, data: {}) }

    it { expect(subject).to eq described_class::TOOL_DEFAULTS[:connect] }
  end

  context 'unknown activity type' do
    before do
      stub_const("QuestionCounter::DEFAULT", default_size)
    end

    let(:classification) {create(:classification, key: 'some-unknown')}
    let(:activity) { create(:activity, classification: classification) }

    it { expect(subject).to eq default_size }
  end

  context 'evidence' do
    let(:activity) { create(:evidence_lms_activity) }

    it { expect(subject).to eq 3 }
  end

  context 'connect' do
    let(:activity) { create(:connect_activity, data: {questions: question_list}) }

    it { expect(subject).to eq question_list.size }
  end

  context 'grammar' do
    let(:activity) { create(:grammar_activity, data: {questions: question_list}) }

    it { expect(subject).to eq question_list.size }
  end

  context 'diagnostic' do
    let(:activity) { create(:diagnostic_activity, data: {questions: question_list}) }

    it { expect(subject).to eq question_list.size }
  end

  context 'proofreader' do
    let(:activity) { create(:proofreader_activity, data: {passage: passage }) }

    it { expect(subject).to eq 3 }
  end

  context 'lessons' do
    context 'value in list' do
      let(:activity) { create(:lesson_activity, uid: '-KsJlSHlJ9G0rlVlRIfk') }

      it { expect(subject).to eq 4 }
    end

    context 'value NOT in list' do
      let(:activity) { create(:lesson_activity, uid: 'asdfsadfsdf') }

      it { expect(subject).to eq described_class::TOOL_DEFAULTS[:lessons] }
    end
  end
end
