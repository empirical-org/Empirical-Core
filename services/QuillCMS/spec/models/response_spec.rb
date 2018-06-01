require "rails_helper"

RSpec.describe Response do
  context "ActiveRecord callbacks" do
    it "after_create_commit calls #create_index_in_elastic_search" do
      response = Response.new()
      expect(response).to receive(:create_index_in_elastic_search)
      response.save
    end

    it "after_update_commit calls #update_index_in_elastic_search" do
      response = Response.create()
      expect(response).to receive(:update_index_in_elastic_search)
      response.update(text: 'covfefe')
    end

    it "after_update_commit calls #update_index_in_elastic_search" do
      response = Response.create()
      expect(response).to receive(:destroy_index_in_elastic_search)
      response.destroy
    end
  end
end
