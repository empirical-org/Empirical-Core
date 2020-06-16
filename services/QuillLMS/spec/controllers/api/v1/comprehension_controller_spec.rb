# Test to verify engine mounted properly
require 'rails_helper'

RSpec.describe Comprehension::ActivitiesController, :type => :controller do
  routes { Comprehension::Engine.routes }

  it "hits the correct engine endpoint and renders json" do
    activity = Comprehension::Activity.create(title: "some title", target_level: 5, parent_activity_id: 1)

    get :show, id: activity.id
    expect(response.status).to eq(200)

    parsed_response = JSON.parse(response.body)

    expect(parsed_response['title']).to eq("some title")
  end
end
