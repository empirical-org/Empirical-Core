require 'rails_helper'

describe PagesHelper do
  describe '#pages_tab_class' do
    it 'should give the right values' do
      allow(helper).to receive(:action_name) { "mission" }
      expect(helper.pages_tab_class("about")).to eq "active"
      allow(helper).to receive(:action_name) { "faq" }
      expect(helper.pages_tab_class("faq")).to eq "active"
      allow(helper).to receive(:action_name) { "press" }
      expect(helper.pages_tab_class("press")).to eq "active"
      allow(helper).to receive(:action_name) { "partners" }
      expect(helper.pages_tab_class("partners")).to eq "active"
      allow(helper).to receive(:action_name) { "news" }
      expect(helper.pages_tab_class("media")).to eq "active"
      allow(helper).to receive(:action_name) { "team" }
      expect(helper.pages_tab_class("team")).to eq "active"
      allow(helper).to receive(:action_name) { "temporarily_render_old_teacher_resources" }
      expect(helper.pages_tab_class("getting-started")).to eq "active"
      allow(helper).to receive(:action_name) { "news" }
      expect(helper.pages_tab_class("news")).to eq "active"
      allow(helper).to receive(:action_name) { "media_kit" }
      expect(helper.pages_tab_class("media_kit")).to eq "active"
      allow(helper).to receive(:action_name) { "impact" }
      expect(helper.pages_tab_class("impact")).to eq "active"
      allow(helper).to receive(:action_name) { "activities" }
      expect(helper.pages_tab_class("standards")).to eq "active"
      allow(helper).to receive(:action_name) { "index" }
      expect(helper.pages_tab_class("topics")).to eq "active"
      allow(helper).to receive(:action_name) { "premium_from_discover" }
      expect(helper.pages_tab_class("premium")).to eq "premium-tab active"
    end
  end

  describe '#subtab_class' do
    it 'should give the right class' do
      allow(helper).to receive(:action_name) { "some name" }
      expect(helper.subtab_class("some name")).to eq "active"
      allow(helper).to receive(:action_name) { "some name" }
      expect(helper.subtab_class("name")).to eq ""
    end
  end
end