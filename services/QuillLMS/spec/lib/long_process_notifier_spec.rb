# frozen_string_literal: true

require 'rails_helper'

describe LongProcessNotifier do
  let(:error) { StandardError }
  let(:key_values) { {key: 'value', key2: 'value2'}}

  describe 'run' do
    subject { described_class.new(error, threshold) }

    let(:threshold) { 1 }
    let(:start) { 1 }
    let(:finish) { start + threshold }
    let(:expected_options) do
      {
        time_to_execute: finish - start
      }
    end

    before do
      allow(LongProcessNotifier).to receive(:current_time).and_return(start, finish)
    end

    it do
      expect(ErrorNotifier).to receive(:report).with(error, expected_options)
      subject.run { nil }
    end

    context "attach time_to_execute to provided options" do
      subject { described_class.new(error, threshold, key_values) }
      let(:expected_options) { key_values.merge({time_to_execute: finish - start}) }

      it do
        expect(ErrorNotifier).to receive(:report).with(error, expected_options)
        subject.run { nil }
      end
    end

    context "runtime less than threshold" do
      let(:finish) { start }

      it do
        expect(ErrorNotifier).not_to receive(:report)
        subject.run { nil }
      end
    end
  end
end
