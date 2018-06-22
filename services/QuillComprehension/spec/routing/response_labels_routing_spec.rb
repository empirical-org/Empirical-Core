require "rails_helper"

RSpec.describe ResponseLabelsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/response_labels").to route_to("response_labels#index")
    end

    it "routes to #new" do
      expect(:get => "/response_labels/new").to route_to("response_labels#new")
    end

    it "routes to #show" do
      expect(:get => "/response_labels/1").to route_to("response_labels#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/response_labels/1/edit").to route_to("response_labels#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/response_labels").to route_to("response_labels#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/response_labels/1").to route_to("response_labels#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/response_labels/1").to route_to("response_labels#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/response_labels/1").to route_to("response_labels#destroy", :id => "1")
    end

  end
end
