# == Schema Information
#
# Table name: activity_classifications
#
#  id                :integer          not null, primary key
#  app_name          :string
#  form_url          :string
#  instructor_mode   :boolean          default(FALSE)
#  key               :string           not null
#  locked_by_default :boolean          default(FALSE)
#  module_url        :string
#  name              :string
#  order_number      :integer          default(999999999)
#  scored            :boolean          default(TRUE)
#  uid               :string           not null
#  created_at        :datetime
#  updated_at        :datetime
#
# Indexes
#
#  index_activity_classifications_on_uid  (uid) UNIQUE
#
require 'rails_helper'

describe ActivityClassification, type: :model, redis: true do
  it { should have_many(:activities) }
  it { should have_many(:concept_results) }

  it_behaves_like "uid"


  let(:activity_classification) { build(:activity_classification) }

  describe 'diagnostic' do
    context 'when it exists' do
      let!(:activity_classification) { create(:diagnostic) }

      it 'should find the activity_classification with diagnostic key' do
        expect(ActivityClassification.diagnostic).to eq(activity_classification)
      end
    end

    context 'when it does not exist' do
      it 'should return nil' do
        expect(ActivityClassification.diagnostic).to eq(nil)
      end
    end
  end

  describe '#form_url' do
    let(:form_url) { "https://hard-coded-domain.com/#{form_path}" }
    let(:activity_classification) { build(:activity_classification, form_url: form_url) }

    context 'simple path' do
      let(:form_path) { 'some_path/with_subdir' }

      it { should_replace_form_url_hardcoded_domain_with_default_url }
    end

    context 'with fragment' do
      let(:form_path) { 'some_path#/tool/-LKX2VhTOrWyUx9?anonymous=true' }

      it { should_replace_form_url_hardcoded_domain_with_default_url }
    end

    context 'without fragment' do
      let(:form_path) { 'path_with_no_fragment?anonymous=true' }

      it { should_replace_form_url_hardcoded_domain_with_default_url }
    end

    def should_replace_form_url_hardcoded_domain_with_default_url
      expect(activity_classification.form_url).to eq "#{ENV['DEFAULT_URL']}/#{form_path}"
    end
  end

  describe '#module_url' do
    let(:module_url) { "https://hard-coded-domain.com/#{module_path}" }
    let(:activity_classification) { build(:activity_classification, module_url: module_url) }

    context 'simple path' do
      let(:module_path) { 'some_path/with_segment' }

      it { should_replace_module_url_hardcoded_domain_with_default_url }
    end

    context 'with fragment' do
      let(:module_path) { 'some_path#/tool/-LKX2VhTOrWyUx9?anonymous=true' }

      it { should_replace_module_url_hardcoded_domain_with_default_url }
    end

    context 'without fragment' do
      let(:module_path) { 'path_with_no_fragment?anonymous=true' }

      it { should_replace_module_url_hardcoded_domain_with_default_url }
    end

    def should_replace_module_url_hardcoded_domain_with_default_url
      expect(activity_classification.module_url).to eq "#{ENV['DEFAULT_URL']}/#{module_path}"
    end
  end
end
