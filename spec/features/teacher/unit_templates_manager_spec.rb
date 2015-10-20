require 'rails_helper'


feature 'unit templates manager', js: true do
  let(:author) { FactoryGirl.create(:author, name: 'author1') }
  let(:section) { FactoryGirl.create(:section, name: 'section1') }
  let(:topic) { FactoryGirl.create(:topic, name: 'topic1', section: section) }
  let(:activity) { FactoryGirl.create(:activity, name: 'activity1', topic: topic) }
  let(:time) {45}
  let!(:unit_template_category_name) { 'Unit Template Category 1' }
  let(:unit_template_category) { FactoryGirl.create(:unit_template_category, name: unit_template_category_name) }

  let!(:unit_template) {
    FactoryGirl.create(:unit_template,
                name: 'Unit Template 1',
                grades: [1,2],
                author: author,
                activities: [activity],
                time: time,
                unit_template_category: unit_template_category
                )
  }

  let!(:unit_template_category2_name) { 'Unit Template Category 2' }
  let!(:unit_template_category2) {FactoryGirl.create(:unit_template_category, name: unit_template_category2_name)}
  let!(:unit_template2) {
    FactoryGirl.create(:unit_template,
                name: 'Unit Template 2',
                grades: [1,2],
                author: author,
                activities: [activity],
                time: time,
                unit_template_category: unit_template_category2
                )
  }

  def assign_btn
    'assign'
  end


  before(:each) do
    vcr_ignores_localhost
    visit('/teachers/unit_templates')
  end

  context 'list of unit_templates' do
    it 'shows unit_template name' do
      expect(page).to have_content(unit_template.name)
      expect(page).to have_content(unit_template2.name)
    end

    it 'can filter by unit_template_category' do
      xpath = "//*[contains(@class, 'list-filter-option') and contains(text(), '#{unit_template_category_name}')]"
      page.find(:xpath, xpath)
          .trigger(:click)

      expect(page).to_not have_content(unit_template2.name)
    end
  end

  context 'unit template profile' do
    it 'is accessible from list of unit_templates' do
      page.first(:css, '.unit-template').trigger(:click)
      expect(page).to have_content(assign_btn)
    end
  end
end