require 'rails_helper'
require 'modules/response_search'

RSpec.describe 'Rack Attack configuration checks', type: :request do
  context 'pentester' do
    it 'should return forbidden for a url in ban list' do
      get '/.env'

      expect(response).to have_http_status(403)
    end

    it 'should return forbidden for a path that matches regex block list' do
      get '/something/something/index.php?something'

      expect(response).to have_http_status(403)
    end

    it 'should let non-banned patterns pass' do
      get '/'

      expect(response).to have_http_status(200)
    end
  end
end
