# frozen_string_literal: true

shared_examples "a simple api request" do
  let(:lwc_model_name) {controller.controller_name.classify.underscore}

  before do
    create_list(model.to_sym, 3)
    get :index, as: :json
  end

  it 'sends a list' do
    expect(response).to be_successful
    json = JSON.parse(response.body)
    expect(json[model.pluralize].length).to eq(3)
  end

  it 'includes only uid and name' do
    json = JSON.parse(response.body)
    hash = json[model.pluralize][0]
    expect(hash.keys).to match_array(['uid', 'name'])
  end
end

shared_examples "an api request" do
  context "has standard response items" do
    describe "root nodes" do
      let(:parsed_body) { JSON.parse(response.body) }

      it { expect(parsed_body.keys).to include('meta') }

      context "meta node" do
        let(:meta) { parsed_body['meta'] }

        it { expect(meta.keys).to match_array(%w(status message errors)) }
      end
    end
  end
end
