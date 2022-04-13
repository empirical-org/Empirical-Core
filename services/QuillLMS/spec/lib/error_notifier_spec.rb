# frozen_string_literal: true

require 'rails_helper'

describe ErrorNotifier do
  describe '#report' do
    let(:error) { StandardError }
    let(:key_values) { {key: 'value', key2: 'value2'}}

    it 'should notify Sentry (Raven) and New Relic' do
      expect(Raven).to receive(:capture_exception).with(error, extra: {}).once
      expect(NewRelic::Agent).to receive(:notice_error).with(error, {}).once

      ErrorNotifier.report(error)
    end

    it 'should notify Sentry (Raven) and New Relic with additional context' do
      expect(Raven).to receive(:capture_exception).with(error, extra: key_values).once
      expect(NewRelic::Agent).to receive(:notice_error).with(error, key_values).once

      ErrorNotifier.report(error, key_values)
    end
  end

  describe "initialization with engine" do
    it "should set ErrorNotifier as Evidence's error notifier" do
      expect(Evidence.error_notifier).to be(ErrorNotifier)
    end
  end
end
