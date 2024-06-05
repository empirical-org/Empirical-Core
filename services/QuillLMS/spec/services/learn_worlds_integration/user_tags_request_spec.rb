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

  describe '#string_to_subject_area_tag' do
    it 'converts a string to a LearnWorlds tag' do
      expect(request.string_to_subject_area_tag('History / Social Studies'))
        .to eq('subject_area_history_social_studies')
      expect(request.string_to_subject_area_tag('English as a New Language'))
        .to eq('subject_area_english_as_a_new_language')
    end
  end

  describe '#tags' do
    context 'when the user is an admin' do
      before do
        allow(user).to receive(:admin?).and_return(true)
      end

      it 'includes the admin tag' do
        expect(request.tags).to include('admin')
      end
    end

    context 'when the user is not an admin' do
      before do
        allow(user).to receive(:admin?).and_return(false)
      end

      it 'does not include the admin tag' do
        expect(request.tags).not_to include('admin')
      end
    end

  end
end
