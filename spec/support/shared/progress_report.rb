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
    end
  end
end