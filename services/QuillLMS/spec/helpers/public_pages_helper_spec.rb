# frozen_string_literal: true

require 'rails_helper'

describe PublicPagesHelper do

  describe '#should_render_react_component' do
    context 'with user' do
      before { allow(helper).to receive(:current_user) { create(:user) } }

      it 'should return true' do
        expect(helper.should_render_react_component).to eq(true)
      end
    end

    context 'with demo user' do
      let!(:demo_user) { User.where(email: Demo::ReportDemoCreator::EMAIL).first || create(:user, email: Demo::ReportDemoCreator::EMAIL) }

      before { allow(helper).to receive(:current_user) { demo_user } }

      it 'should return false' do
        expect(helper.should_render_react_component).to eq(false)
      end
    end

    context 'with no user' do
      before { allow(helper).to receive(:current_user) { nil } }

      it 'should return false' do
        expect(helper.should_render_react_component).to eq(false)
      end
    end

  end

  describe '#featured_activity_url' do
    it('should return the expected url path string') do
      expect(helper.featured_activity_url(PublicPagesHelper::STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID)).to eq("#{ENV['DEFAULT_URL']}/activities/packs/#{PublicPagesHelper::STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID}")
      expect(helper.featured_activity_url(PublicPagesHelper::INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID)).to eq("#{ENV['DEFAULT_URL']}/activities/packs/#{PublicPagesHelper::INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID}")
      expect(helper.featured_activity_url(PublicPagesHelper::ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID)).to eq("#{ENV['DEFAULT_URL']}/activities/packs/#{PublicPagesHelper::ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID}")
    end
  end

  describe '#evidence_article_url' do
    let(:blog_post1) { create(:blog_post, external_link: 'test_url') }
    let(:blog_post2) { create(:blog_post) }

    it('should return the expected url path string') do
      expect(helper.evidence_article_url(blog_post1)).to eq('test_url')
      expect(helper.evidence_article_url(blog_post2)).to eq('/teacher-center/post-title-2')
    end
  end
end
