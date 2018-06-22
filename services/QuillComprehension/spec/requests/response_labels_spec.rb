require 'rails_helper'

RSpec.describe "ResponseLabels", type: :request do
  describe "GET /response_labels" do
    it "works! (now write some real specs)" do
      get response_labels_path
      expect(response).to have_http_status(200)
    end
  end
end
