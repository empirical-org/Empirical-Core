require 'rails_helper'

describe ELLStarterDiagnosticEmailJob do
  let(:job) { described_class.new}

  describe '#perform' do
    it 'should send ELL Starter Diagnostic information' do
      name = "Eric"
      email = "eric@quill.org"
      expect(UserMailer).to receive(:ell_starter_diagnostic_info_email).with(name, email).and_return(double('mailer', deliver_now!: true))

      job.perform(name, email)
    end
  end
end
