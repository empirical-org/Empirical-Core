shared_examples_for "Progress Report" do

  let(:default_filters) { {} }

  def login
    session[:user_id] = teacher.id
  end

  describe 'GET #index HTML' do
    subject { get :index, params: default_filters }

    it 'requires an authenticated teacher' do
      subject
      expect(response.status).to eq(303)
    end

    describe 'when the teacher is logged in' do
      before { login }

      it 'renders the view' do
        subject
        expect(response.status).to eq(200)
      end
    end
  end

  describe 'GET #index JSON' do
    subject { get :index, params: default_filters.merge(format: :json) }

    let(:json) { JSON.parse(response.body) }

    it 'requires a logged-in teacher' do
      subject
      expect(response.status).to eq(303)
    end

    describe 'when the teacher is logged in' do
      before { login }

      it 'sends a Vary: Accept header (for Chrome caching issues)' do
        subject
        expect(response.headers['Vary']).to eq('Accept')
      end

      it 'renders a JSON response' do
        subject
        expect(response.status).to eq(200)
        expect(json).to_not be_nil
      end

      it 'renders a JSON with the results key' do
        subject
        expect(json).to have_key(result_key)
      end

      it 'renders the correct number of results in the JSON' do
        subject
        expect(json[result_key].size).to eq(expected_result_count)
      end
    end
  end
end

shared_examples_for "filtering progress reports by Unit" do
  let(:filters) { { unit_id: filter_value, xhr: true, format: :json } }

  describe 'GET #index JSON' do
    before { login }

    subject { get :index, params: default_filters.merge(filters) }

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

shared_examples_for "exporting to CSV" do
  before do
    login
    subject
  end

  subject { get :index, params: default_filters.merge(format: :json) }

  let(:json) { JSON.parse(response.body) }

  it "includes the teacher data in the JSON response" do
    expect(json).to have_key('teacher')
    expect(json['teacher']['email']).to be_present
  end
end
