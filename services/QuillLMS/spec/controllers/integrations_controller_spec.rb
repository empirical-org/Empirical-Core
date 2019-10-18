require 'rails_helper'

describe IntegrationsController do

  describe '#amplify' do
    it 'should render the correct template' do
      get :amplify
      expect(response).to render_template 'integrations/amplify'
    end

    it 'should assign the unit_templates' do
      create(:partner_content)
      get :amplify

      templates = assigns(:unit_templates)
      expect(templates.count).to eq 1
      expect(templates.first.class.to_s).to eq 'UnitTemplate'
      expect(response).to render_template 'integrations/amplify'
    end
  end
end
