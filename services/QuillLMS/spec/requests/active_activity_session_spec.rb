require 'rails_helper'

describe 'Active Activity Session', type: :request do

  let(:session) {create(:active_activity_session) }
  let(:data_file) {File.open(Rails.root.join('spec/requests/active_activity_session_sample.json'))}
  let(:large_data_blob) {JSON.parse(data_file.read)}

  describe '#update' do
    it 'updates and returns no content' do

      Rails.logger.info "\n\nStart controller\n\n"
      put "/api/v1/active_activity_sessions/#{session.id}", params: {active_activity_session: large_data_blob}, as: :json

      Rails.logger.info "\n\nEnd controller\n\n"

      expect(response.status).to eq(204)
      expect(response.body).to eq("")
    end
  end
end
