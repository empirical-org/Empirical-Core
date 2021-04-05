require 'rails_helper'

describe ErrorsController do
  describe '#error_404' do
    it 'should set not found path' do
      get :error_404, params: { not_found: "www.test.com" }
      assert_response :not_found
    end
  end

  describe '#error_500' do
    it 'should kick off the error worker' do
      expect(ErrorWorker).to receive(:perform_async)
      get :error_500
    end
  end
end