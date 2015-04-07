shared_examples_for "filtering progress reports by Unit" do

  let(:filters) { default_filters.merge({unit_id: filter_value})}

  describe 'XHR GET #index' do
    before do
      login
    end

    subject { xhr :get, :index, filters }
    let(:json) { JSON.parse(response.body) }

    it "can filter the progress report by unit" do
      subject
      expect(json[result_key].size).to eq(expected_result_count)
    end

    it "renders a list of units for display" do
      subject
      expect(json['units']).to respond_to(:size)
      expect(json['units'].size).to be > 0
    end
  end
end