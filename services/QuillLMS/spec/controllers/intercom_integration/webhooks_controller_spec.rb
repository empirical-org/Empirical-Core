# frozen_string_literal: true

require 'rails_helper'

RSpec.describe IntercomIntegration::WebhooksController, type: :controller do

  describe '#create' do
    context 'authentication is valid, and payload is valid' do
      let(:user) { create(:user) }
      let(:user_payload) {
        {
          'id' => user.id,
          'email' => user.email,
          'name' => user.name,
          'phone' => '555-5555',
          'location_data' => {
            'postal_code' => '11111'
          }
        }
      }
      let!(:parsed_payload) {
        {
          'topic' => 'user.tag.created',
          'data' => { 'item' => {
            'tag' => { 'name' => 'Quote Request School' },
            'user' => user_payload
          } }
        }
      }

      before do
        # We don't have signed headers for this test, so skip verification
        allow_any_instance_of(IntercomIntegration::WebhooksController).to receive(:verify_signature).and_return(nil)
        # We don't need to sync data to vitally when creating new records
        allow_any_instance_of(SalesFormSubmission).to receive(:vitally_callbacks)
      end

    # TODO: Re-enable this spec when we re-enable the route for this controller
    #   it 'creates a new sales form submission record' do
    #     post :create, body: parsed_payload.to_json, as: :json
  
    #     expect(response.status).to eq(200)
    #   end
  
    #   it 'creates a new sales form submission record with data from existing user record if user already exists' do
    #     expect(SalesFormSubmission).to receive(:create!).with(
    #       first_name: user.name.split[0],
    #       last_name: user.name.split[1],
    #       email: user.email,
    #       phone_number: user_payload["phone"],
    #       zipcode: user_payload["location_data"]["postal_code"],
    #       school_name: user&.school&.name,
    #       district_name: user&.school&.district&.name,
    #       source: SalesFormSubmission::INTERCOM_SOURCE,
    #       intercom_link: "https://app.intercom.com/a/apps/v2ms5bl3/users/#{user.id}/all-conversations",
    #       collection_type: SalesFormSubmission::SCHOOL_COLLECTION_TYPE,
    #       submission_type: SalesFormSubmission::QUOTE_REQUEST_TYPE
    #     ).and_call_original
  
    #     expect { post :create, body: parsed_payload.to_json, as: :json }
    #       .to change(User, :count).by(0)
  
    #     expect(response.status).to eq(200)
    #   end
  
    #   it 'creates a new sales form submission record with data from a newly created user record if user does not exist' do
    #     user.destroy!
  
    #     expect(SalesFormSubmission).to receive(:create!).with(
    #       first_name: user.name.split[0],
    #       last_name: user.name.split[1],
    #       email: user.email,
    #       phone_number: user_payload["phone"],
    #       zipcode: user_payload["location_data"]["postal_code"],
    #       school_name: user&.school&.name,
    #       district_name: user&.school&.district&.name,
    #       source: SalesFormSubmission::INTERCOM_SOURCE,
    #       intercom_link: "https://app.intercom.com/a/apps/v2ms5bl3/users/#{user.id}/all-conversations",
    #       collection_type: SalesFormSubmission::SCHOOL_COLLECTION_TYPE,
    #       submission_type: SalesFormSubmission::QUOTE_REQUEST_TYPE
    #     ).and_call_original
  
    #     expect { post :create, body: parsed_payload.to_json, as: :json }
    #       .to change(User, :count).by(1)
  
    #     expect(response.status).to eq(200)
    #     expect(User.find_by_email(user_payload['email'])).to be
    #   end
    # end
  
    # context 'authentication not valid' do
  
    #   # Basically, since we're not providing signed headers, this will be invalid
    #   # by default
    #   it 'raises error' do
    #     expect { post :create }
    #       .to raise_error(described_class::UnauthorizedIntercomWebhookCallError)
    #   end
    end
  end
end
