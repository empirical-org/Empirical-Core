require 'rails_helper'

describe StatusesController, type: :controller do
  describe '#deployment_notification' do 
    let(:params) do 
      {
        head_long: 'abcdef',
        release: 'v1',
        git_log: 'The log',
        user: 'Ripley'
      }
    end

    context 'upstream 2xx response' do 
      it 'should render OK' do 
        VCR.use_cassette('new_relic_deployment_notification') do 
          post :deployment_notification, **params
        end
        expect(response.status).to eq 200
        expect(response.body).to eq 'OK'
      end
    end

    context 'unhandled faraday exception' do 
      it 'should return with status 500' do 
        allow(Faraday).to receive(:post).and_raise('Faraday exception')

        expect {
          post :deployment_notification, **params
        }.to_not raise_error

        expect(response.status).to eq 500
        expect(response.body).to match(/Error/)
      end
    end

    context 'upstream non-2xx response' do 
      it 'should return with status 502' do 
        resp = double
        allow(resp).to receive(:status) { 400 }
        allow(Faraday).to receive(:post).and_return(resp)

        expect {
          post :deployment_notification, **params
        }.to_not raise_error

        expect(response.status).to eq 502
        expect(response.body).to match(/Error/)
      end
    end
  end

end
