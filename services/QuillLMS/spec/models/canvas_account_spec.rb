# frozen_string_literal: true

# == Schema Information
#
# Table name: canvas_accounts
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint           not null
#  external_id        :string           not null
#  user_id            :bigint           not null
#
# Indexes
#
#  index_canvas_accounts_on_canvas_instance_id_and_external_id  (canvas_instance_id,external_id) UNIQUE
#  index_canvas_accounts_on_user_id                             (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe CanvasAccount, type: :model do
  subject { create(:canvas_account) }

  it { should be_valid }

  it { should belong_to(:canvas_instance) }
  it { should belong_to(:user) }

  describe '#user_external_id' do
    let(:canvas_account) { create(:canvas_account) }
    let(:canvas_instance_id) { canvas_account.canvas_instance_id }
    let(:external_id) { canvas_account.external_id }

    subject { canvas_account.user_external_id }


    it { is_expected.to eq [canvas_instance_id, external_id].join(':') }
  end

  describe '.build_user_external_id' do
    subject { described_class.build_user_external_id(canvas_instance_id, external_id) }

    let(:canvas_instance_id) { Faker::Number.number }
    let(:external_id) { Faker::Number.number }

    it { is_expected.to eq [canvas_instance_id, external_id].join(':') }

    it 'has .unpack_user_external_id! is its inverse' do
      expect(described_class.unpack_user_external_id!(subject)).to eq [canvas_instance_id, external_id]
    end
  end

  describe '.custom_create_by_user_external_id!' do
    subject { described_class.custom_create_by_user_external_id!(user_external_id, user_id) }

    let(:user_id) { create(:user).id }

    context 'invalid user_external_id format' do
      let(:user_external_id) { nil }

      it { expect { subject }.to raise_error(described_class::InvalidUserExternalIdFormatError) }
    end

    context 'valid user_external_id' do
      let(:user_external_id) { described_class.build_user_external_id(canvas_instance_id, external_id) }
      let(:canvas_instance_id) { create(:canvas_instance).id }
      let(:external_id) { Faker::Number.number }

      it { is_expected.to be_a described_class }
    end
  end

  describe '.custom_find_by_user_external_id' do
    subject { described_class.custom_find_by_user_external_id(user_external_id) }

    context 'invalid user_external_id format' do
      let(:user_external_id) { nil }

      it { is_expected.to be_nil }
    end

    context 'valid user_external_id' do
      let(:user_external_id) { described_class.build_user_external_id(canvas_instance_id, external_id) }

      context 'canvas_instance does not exist' do
        let(:canvas_instance_id) { Faker::Number.number }
        let(:external_id) { Faker::Number.number }

        it { is_expected.to be_nil }
      end

      context 'canvas_instance exists' do
        let(:canvas_instance_id) { create(:canvas_instance).id }

        context 'canvas_account exists' do
          let!(:canvas_account) { create(:canvas_account, canvas_instance_id: canvas_instance_id) }
          let(:external_id) { canvas_account.external_id }

          it { is_expected.to eq canvas_account }
        end

        context 'canvas_account does notexist' do
          let(:external_id) { Faker::Number.number }

          it { is_expected.to be_nil}
        end
      end
    end
  end

  describe '.unpack_user_external_id!' do
    subject { described_class.unpack_user_external_id!(user_external_id) }

    let(:user_external_id) { '1:2' }

    it { is_expected.to eq ['1', '2'] }

    it 'has .build_user_external_id as its inverse' do
      expect(described_class.build_user_external_id(*subject)).to eq user_external_id
    end

    context 'invalid user_external_id format' do
      let(:user_external_id) { nil }

      it { expect { subject }.to raise_error(described_class::InvalidUserExternalIdFormatError) }
    end
  end

  describe '.valid_user_external_id_format?' do
    subject { described_class.valid_user_external_id_format?(user_external_id) }

    context 'invalid user_external_id format' do
      context 'nil user_external_id' do
        let(:user_external_id) { nil }

        it { is_expected.to be_falsey }
      end

      context 'empty user_external_id' do
        let(:user_external_id) { '' }

        it { is_expected.to be false }
      end

      context 'no semicolon' do
        let(:user_external_id) { 'invalid' }

        it { is_expected.to be false }
      end

      context 'multiple semicolons' do
        let(:user_external_id) { '1:2:3' }

        it { is_expected.to be false }
      end

      context 'missing canvas_instance_id' do
        let(:user_external_id) { ':1a32fa' }

        it { is_expected.to be false }
      end

      context 'missing external_id' do
        let(:user_external_id) { '1:' }

        it { is_expected.to be false }
      end

      context 'missing canvas_instance_id and external_id' do
        let(:user_external_id) { ':' }

        it { is_expected.to be false }
      end
    end

    context 'valid user_external_id' do
      let(:user_external_id) { '1:324ad23' }

      it { is_expected.to be true }
    end
  end
end
