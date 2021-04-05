require 'rails_helper'

describe Cms::ContentPartnersController do
  let!(:user) { create(:staff) }
  let!(:content_partners) { create_list(:content_partner, 10) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    it 'returns a json hash with all the content_partners and change logs' do
      get :index
      parsed_response = JSON.parse(response.body)
      content_partner_results = parsed_response["content_partners"]
      content_partners.each do |t|
        expect(content_partner_results.find { |tr| tr["id"] == t.id }).to be
      end
    end
  end

  describe '#create' do
    it 'creates a new content_partner' do
      post :create,
        params: {
          content_partner: {
            name: 'New ContentPartner',
            level: 3,
            visible: true,
            description: 'Blah da blah'
          }
        }

      parsed_response = JSON.parse(response.body)
      id = parsed_response["content_partner"]["id"]
      expect(id).to be
      expect(ContentPartner.find_by_id(id)).to be
    end
  end

  describe '#update' do
    it 'updates the content partner' do
      new_name = 'New Content Partner Name'
      id = content_partners[0].id
      put :update,
        params: {
          id: id,
          content_partner: {
            name: new_name,
            id: id
          }
        }
        
      expect(ContentPartner.find_by_id(id).name).to eq(new_name)
    end
  end
end
