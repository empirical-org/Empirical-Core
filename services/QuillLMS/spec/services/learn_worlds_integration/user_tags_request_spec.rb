# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::UserTagsRequest do
  let(:user) { create(:user, role: 'teacher') }
  let(:teacher_info) { create(:teacher_info, user: user) }
  let!(:learn_worlds_account) { create(:learn_worlds_account, user: user)}
  let(:request) { described_class.new(user) }

  before do
    allow(user).to receive(:nil?).and_return(false)
  end

  describe '#run' do
    context 'when user is nil' do
      before do
        allow(request).to receive(:user).and_return(nil)
      end

      it 'raises a NilUserError' do
        expect { request.run }.to raise_error(LearnWorldsIntegration::UserRequest::NilUserError)
      end
    end

    context 'when user is present' do
      it 'makes a PUT request to the correct endpoint with the correct body and headers' do
        allow(HTTParty).to receive(:put)
        expect(HTTParty).to receive(:put).with(
          request.endpoint, body: request.body, headers: request.headers
        )
        request.run
      end
    end
  end

end
