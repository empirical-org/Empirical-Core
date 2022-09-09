# frozen_string_literal: true

require 'rails_helper'

describe OrttoIntegration::NewsletterWorker do
  let!(:user) { create(:user, email: 'a@b.com') }
  let(:valid_params) do
    [
      user.email,
      true
    ]
  end

  context 'API call succeeds' do
    it 'should not raise error or invoke ErrorNotifier' do
      expect(ErrorNotifier).not_to receive(:report)
      allow(Faraday).to receive(:post)
      expect { described_class.new.perform(*valid_params) }.not_to raise_error
    end
  end

  context 'API call fails' do
    it 'should invoke ErrorNotifier' do
      expect(ErrorNotifier).to receive(:report)
      allow(Faraday).to receive(:post).and_raise(StandardError, 'hell').once
      expect { described_class.new.perform(*valid_params) }.not_to raise_error
    end
  end
end
