# frozen_string_literal: true

require 'rails_helper'

describe ErrorNotifier do
  let(:error) { StandardError }
  let(:key_values) { {key: 'value', key2: 'value2'}}

  describe '#report' do

    it 'should notify Sentry and New Relic' do
      expect(Sentry).to receive(:capture_exception).with(error, extra: {}).once
      expect(NewRelic::Agent).to receive(:notice_error).with(error, {}).once

      ErrorNotifier.report(error)
    end

    it 'should notify Sentry and New Relic with additional context' do
      expect(Sentry).to receive(:capture_exception).with(error, extra: key_values).once
      expect(NewRelic::Agent).to receive(:notice_error).with(error, key_values).once

      ErrorNotifier.report(error, key_values)
    end
  end

  describe 'report_long_running' do
    let(:threshold) { 1 }
    let(:start) { 0 }
    let(:finish) { threshold }
    let(:expected_options) do
      {
        time_to_execute: finish - start
      }
    end

    before do
      allow(described_class).to receive(:current_time).and_return(start, finish)
    end

    it do
      expect(ErrorNotifier).to receive(:report).with(error, expected_options)
      ErrorNotifier.report_long_running(error, threshold) { nil }
    end

    context "attach time_to_execute to provided options" do
      let(:expected_options) { key_values.merge({time_to_execute: finish - start}) }


      it do
        expect(ErrorNotifier).to receive(:report).with(error, expected_options)
        ErrorNotifier.report_long_running(error, threshold, key_values) { nil }
      end
    end

    context "runtime less than threshold" do
      let(:finish) { start }

      it do
        expect(ErrorNotifier).not_to receive(:report)
        ErrorNotifier.report_long_running(error, threshold) { nil }
      end
    end
  end

  describe "initialization with engine" do
    it "should set ErrorNotifier as Evidence's error notifier" do
      expect(Evidence.error_notifier).to be(ErrorNotifier)
    end
  end
end
