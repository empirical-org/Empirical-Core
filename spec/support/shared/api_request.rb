shared_context "calling the api" do
  render_views

  let(:application) { Doorkeeper::Application.create!(:name => "MyApp", :redirect_uri => "http://app.com") }
  let(:user) { FactoryGirl.create(:user) }
  let(:token) { Doorkeeper::AccessToken.create! :application_id => application.id, :resource_owner_id => user.id }

  before do
    allow(controller).to receive(:doorkeeper_token) { token }
  end

  it_behaves_like "an api request"

end

shared_examples "an api request" do
  context "has standard response items" do

    describe "root nodes" do
      it "has a meta attribute" do
        expect(@parsed_body.keys).to include('meta')
      end

      context "meta node" do
        before(:each) do
          @meta = @parsed_body['meta']
        end

        it "has a status attribute" do
          expect(@meta.keys).to include('status')
        end

        it "has a message attribute" do
          expect(@meta.keys).to include('message')
        end

        it "has a errors attribute" do
          expect(@meta.keys).to include('errors')
        end

      end

    end
  end
end
