# frozen_string_literal: true

require 'rails_helper'

RSpec.describe IntercomIntegration::WebhooksController, type: :controller do

  describe '#create' do
    context 'authentication is valid, and payload is valid' do
      it 'creates a new sales form submission record' do
        raise "test not written"
      end

      it 'creates a new sales form submission record with data from existing user record if user already exists' do
        raise "test not written"
      end

      it 'creates a new sales form submission record with data from a newly created user record if user does not exist' do
        raise "test not written"
      end
    end

    context 'authentication not valid' do
      it 'raises error' do
        raise "test not written"
      end
    end
  end
end
