# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_instances
#
#  id         :bigint           not null, primary key
#  url        :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_canvas_instances_on_url  (url) UNIQUE
#
require 'rails_helper'

RSpec.describe CanvasInstance, type: :model do
  subject { create(:canvas_instance) }

  it { expect(subject).to be_valid }

  it { should have_many(:canvas_instance_schools).dependent(:destroy) }
  it { should have_many(:schools).through(:canvas_instance_schools) }
  it { should have_many(:canvas_accounts).dependent(:destroy) }
  it { should have_many(:users).through(:canvas_accounts) }
  it { should have_one(:canvas_config).dependent(:destroy)}
  it { should have_many(:canvas_instance_auth_credentials).dependent(:destroy) }

  it { should validate_uniqueness_of(:url).case_insensitive }
  it { should validate_presence_of(:url) }

  context 'callbacks' do
    context 'before_validation' do
      let(:canvas_instance) { build(:canvas_instance, url: url) }

      context 'url with upper case' do
        let(:url) { 'http://EXAMPLE.com' }

        it { expect { canvas_instance.validate }.to change(canvas_instance, :url).from(url).to('http://example.com') }
      end

      context 'url with trailing slash' do
        let(:url) { 'http://example.com/' }

        it { expect { canvas_instance.validate }.to change(canvas_instance, :url).from(url).to('http://example.com') }
      end
    end
  end

  context 'url validator' do
    subject { create(:canvas_instance, url: url) }

    context 'valid url' do
      let(:url) { 'https://example.instructure.com' }

      it { expect(subject.errors).to be_empty }
    end

    context 'invalid url' do
      let(:url) { 'not-a-url' }

      it { expect { subject }.to raise_error(ActiveRecord::RecordInvalid) }
    end
  end
end
