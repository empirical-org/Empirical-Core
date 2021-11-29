# frozen_string_literal: true

require 'rails_helper'

describe IntegrationsController do

  describe '#amplify' do
    it 'should render the correct template' do
      get :amplify
      expect(response).to render_template 'integrations/amplify'
    end

    it 'should assign the partner_content' do
      create(:partner_content)
      get :amplify

      partner_content = assigns(:partner_content)
      expect(partner_content.count).to eq 1
      expect(partner_content.first.class.to_s).to eq 'PartnerContent'
      expect(partner_content.first.content.class.to_s).to eq 'UnitTemplate'
      expect(response).to render_template 'integrations/amplify'
    end
  end
end
