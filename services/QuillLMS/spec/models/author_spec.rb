# frozen_string_literal: true

# == Schema Information
#
# Table name: authors
#
#  id     :integer          not null, primary key
#  avatar :text
#  name   :string(255)
#
require 'rails_helper'

describe Author, type: :model, redis: true do
  it { should have_many(:unit_templates) }
  it { is_expected.to callback(:delete_relevant_caches).after(:commit) }

  DEFAULT_AVATAR_TEST_URL = 'https://assets.quill.org/images/authors/placeholder.png'

  describe 'default avatar url' do
    it 'should have the correct default avatar url' do
      expect(Author::DEFAULT_AVATAR_URL).to eq(DEFAULT_AVATAR_TEST_URL)
    end
  end

  describe 'delete relevant caches after commit' do
    let(:author) { create(:author) }
    let(:template) { create(:unit_template, author: author) }

    it 'should clear the unit templates' do
      template.get_cached_serialized_unit_template
      author.run_callbacks(:commit)
      expect($redis.get("unit_template_id:#{template.id}_serialized")).to eq nil
      expect($redis.get('production_unit_templates')).to eq nil
      expect($redis.get('beta_unit_templates')).to eq nil
      expect($redis.get('alpha_unit_templates')).to eq nil
    end
  end

  describe 'avatar url' do
    context 'when avatar exists' do
      let(:author) { create(:author) }

      it 'should return the avatar' do
        expect(author.avatar_url).to eq(author.avatar)
      end
    end

    context 'when avatar does not exist' do
      let(:author) { create(:author, avatar: '') }

      it 'should return the default avatar url' do
        expect(author.avatar_url).to eq(DEFAULT_AVATAR_TEST_URL)
      end
    end
  end
end
