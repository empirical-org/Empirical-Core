# frozen_string_literal: true

require 'rails_helper'

describe ErrorNotifier do
  describe '#report' do
    class TestExampleError < StandardError; end
    let(:error) { TestExampleError}

    it 'should notify Sentry (Raven) and New Relic' do
      expect(Raven).to receive(:capture_exception).with(error)
      expect(NewRelic::Agent).to receive(:notice_error).with(error)

      ErrorNotifier.report(error)
    end
  end

  describe "initialization with engine" do
    it "should set ErrorNotifier as Evidence's error notifier" do
      expect(Evidence.error_notifier).to be(ErrorNotifier)
    end
  end
end
