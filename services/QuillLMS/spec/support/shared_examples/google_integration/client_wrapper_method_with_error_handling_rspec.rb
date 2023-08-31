# frozen_string_literal: true

# require 'rails_helper'

# RSpec.shared_examples 'a google api wrapper method with error handling' do |api_method|
#   let(:error400) { Google::Apis::ClientError.new('Bad Request', status_code: 400) }
#   let(:error403) { Google::Apis::ClientError.new('Forbidden', status_code: 403) }
#   let(:error403) { Google::Apis::ClientError.new('Not Found', status_code: 404) }

#   [Google::Apis::TransmissionError, Google::Apis::ServerError].each do |error|
#     context 'when google api raises an error' do
#       before do
#         call_count = 0

#         allow(api).to receive(api_method) do
#           call_count += 1
#           raise error if call_count <= 2
#         end
#       end

#       it { expect { subject }.not_to raise_error }
#     end
#   end

#   context 'when max retries are exceeded' do
#     before { allow(api).to receive(method).and_raise(error) }

#     it 'notifies the error after max retries' do
#       expect(ErrorNotifier).to receive(:report).with(instance_of(error), user_id: user.id)
#       subject
#     end

#     it { is_expected.to eq([]) }
#   end
# end