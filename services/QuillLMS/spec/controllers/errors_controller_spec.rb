# frozen_string_literal: true

require 'rails_helper'

describe ErrorsController do
  describe '#error404' do
    it 'should set not found path' do
      get :error404, params: { not_found: "www.test.com" }
      expect(response).to have_http_status(404)
      assert_response :not_found
    end
  end

  describe '#error500' do
    it 'should kick off the error worker' do
      expect(ErrorWorker).to receive(:perform_async)
      get :error500
    end
  end
end
