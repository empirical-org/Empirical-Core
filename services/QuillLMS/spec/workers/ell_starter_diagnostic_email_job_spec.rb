require 'rails_helper'

describe ELLStarterDiagnosticEmailJob do
  let(:mail) { described_class.new}

  describe '#perform' do
    it 'should send ELL Starter Diagnostic information' do
      ell_email = mail.perform("Eric", "eric@quill.org")
      last_email = ActionMailer::Base.deliveries.last
      expect(ell_email.to).to eq ["eric@quill.org"]
      expect(ell_email).to eq last_email
    end
  end
end