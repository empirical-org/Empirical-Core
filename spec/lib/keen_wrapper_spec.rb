require 'rails_helper'

describe KeenWrapper do
  let(:event) { 'foobar' }
  let(:options) { {} }
  subject { KeenWrapper.publish(event, options) }

  context 'when enabled' do
    before do
      expect(KeenWrapper).to receive(:enabled?) { true }
    end

    it 'publishes events to Keen' do
      expect(Keen).to receive(:publish).with(event, options) { true }
      subject
    end

    context 'when publishing fails' do
      it 'catches and logs failed Keen requests' do
        response_body = 'error'
        expect(Keen).to receive(:publish).with(event, options).and_raise(Keen::BadRequestError, response_body)
        expect(Rails.logger).to receive(:error).with(/#{response_body}/)
        expect {
          subject
          }.to_not raise_error

      end
    end
  end

  context 'when disabled' do
    before do
      expect(KeenWrapper).to receive(:enabled?) { false }
    end

    it 'does not publish events to Keen' do
      expect(Keen).to_not receive(:publish)
      subject
    end
  end
end