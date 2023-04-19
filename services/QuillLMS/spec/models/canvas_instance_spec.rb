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
require 'rails_helper'

RSpec.describe CanvasInstance, type: :model do
  let(:canvas_instance) { create(:canvas_instance) }

  it { expect(canvas_instance).to be_valid }

  it { should have_many(:school_canvas_instances).dependent(:destroy) }
  it { should have_many(:schools).through(:school_canvas_instances) }

  it { should have_many(:canvas_accounts).dependent(:destroy) }
  it { should have_many(:users).through(:canvas_accounts) }

  it { should have_many(:canvas_configs).dependent(:destroy)}

  context 'callbacks' do
    context 'before_validation' do
      it 'converts the url to lower case' do
        canvas_instance = build(:canvas_instance, url: 'http://EXAMPLE.com')

        expect { canvas_instance.validate }
          .to change { canvas_instance.url }
          .from('http://EXAMPLE.com')
          .to('http://example.com')
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
