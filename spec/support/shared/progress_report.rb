shared_examples_for "Progress Report" do
  render_views

  let(:default_filters) { {} }

  def login
    session[:user_id] = teacher.id
  end

  describe 'GET #index' do
    subject { get :index, default_filters }

    it 'requires an authenticated teacher' do
      subject
      expect(response.status).to eq(401)
    end

    describe 'when the teacher is logged in' do
      before do
        login
      end

      it 'renders the view' do
        subject
        expect(response.status).to eq(200)
      end
    end
  end

  describe 'XHR GET #index' do
    subject { xhr :get, :index, default_filters }
    let(:json) { JSON.parse(response.body) }

    it 'requires a logged-in teacher' do
      subject
      expect(response.status).to eq(401)
    end

    describe 'when the teacher is logged in' do
      before do
        login
      end

      it 'sends a Vary: Accept header (for Chrome caching issues)' do
        subject
        expect(response.headers['Vary']).to eq('Accept')
      end

      it 'renders a JSON response' do
        subject
        expect(response.status).to eq(200)
        expect(json).to_not be_nil
      end

      it 'renders the correct number of results in the JSON' do
        subject
        expect(json[result_key].size).to eq(expected_result_count)
      end
    end
  end
end

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

shared_examples_for "exporting to CSV" do
  before do
    login
    subject
  end

  subject { xhr :get, :index, default_filters }
  let(:json) { JSON.parse(response.body) }

  it "includes the teacher data in the JSON response" do
    expect(json).to have_key('teacher')
    expect(json['teacher']['email']).to be_present
  end
end