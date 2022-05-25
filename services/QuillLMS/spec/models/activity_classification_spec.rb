# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_classifications
#
#  id                :integer          not null, primary key
#  app_name          :string(255)
#  form_url          :string(255)
#  instructor_mode   :boolean          default(FALSE)
#  key               :string(255)      not null
#  locked_by_default :boolean          default(FALSE)
#  module_url        :string(255)
#  name              :string(255)
#  order_number      :integer          default(999999999)
#  scored            :boolean          default(TRUE)
#  uid               :string(255)      not null
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
  it { should have_many(:user_activity_classifications).dependent(:destroy) }

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
    form_urls = %w[
      https://www.quill.org/evidence/#/play
      https://www.quill.org/proofreader/#/play/pf
      https://www.quill.org/diagnostic/#/play/diagnostic/
      https://www.quill.org/grammar/#/play/sw/
      https://www.quill.org/connect/#/play/lesson/
      https://www.quill.org/lessons/#/
    ]

    form_urls.each do |form_url|
      let(:activity_classification) { build(:activity_classification, form_url: form_url) }
      let(:url_path) { form_url.gsub('https://www.quill.org', '') }

      it 'uses default url in place of any hardcoded domain value' do
        expect(activity_classification.form_url).to eq "#{ENV['DEFAULT_URL']}#{url_path}"
      end
    end
  end

  describe '#module_url' do
    module_urls = %w[
      https://www.quill.org/evidence/#/play
      https://www.quill.org/proofreader/#/play/pf
      https://www.quill.org/diagnostic/#/play/diagnostic/
      https://www.quill.org/grammar/#/play/sw/
      https://www.quill.org/connect/#/play/lesson/
      https://www.quill.org/lessons/#/play/class-lessons/
    ]

    module_urls.each do |module_url|
      let(:activity_classification) { build(:activity_classification, module_url: module_url) }
      let(:url_path) { module_url.gsub('https://www.quill.org', '') }

      it 'uses default url in place of any hardcoded domain value' do
        expect(activity_classification.module_url).to eq "#{ENV['DEFAULT_URL']}#{url_path}"
      end
    end
  end
end
