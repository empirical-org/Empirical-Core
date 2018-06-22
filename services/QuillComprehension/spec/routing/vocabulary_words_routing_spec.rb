require "rails_helper"

RSpec.describe VocabularyWordsController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/vocabulary_words").to route_to("vocabulary_words#index")
    end

    it "routes to #new" do
      expect(:get => "/vocabulary_words/new").to route_to("vocabulary_words#new")
    end

    it "routes to #show" do
      expect(:get => "/vocabulary_words/1").to route_to("vocabulary_words#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/vocabulary_words/1/edit").to route_to("vocabulary_words#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/vocabulary_words").to route_to("vocabulary_words#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/vocabulary_words/1").to route_to("vocabulary_words#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/vocabulary_words/1").to route_to("vocabulary_words#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/vocabulary_words/1").to route_to("vocabulary_words#destroy", :id => "1")
    end

  end
end
