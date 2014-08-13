require 'spec_helper'

shared_context "an api request" do
  render_views

  let(:application) { Doorkeeper::Application.create!(:name => "MyApp", :redirect_uri => "http://app.com") }
  let(:user) { FactoryGirl.create(:user) }
  let(:token) { Doorkeeper::AccessToken.create! :application_id => application.id, :resource_owner_id => user.id }

  before do
    allow(controller).to receive(:doorkeeper_token) { token }
  end


end
