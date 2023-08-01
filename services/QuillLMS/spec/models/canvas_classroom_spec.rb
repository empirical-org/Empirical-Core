# frozen_string_literal: true

# == Schema Information
#
# Table name: provider_classrooms
#
#  id                 :bigint           not null, primary key
#  type               :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  canvas_instance_id :bigint
#  classroom_id       :bigint           not null
#  external_id        :string           not null
#
# Indexes
#
#  index_provider_classrooms_on_canvas_instance_id  (canvas_instance_id)
#  index_provider_classrooms_on_classroom_id        (classroom_id)
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#  fk_rails_...  (classroom_id => classrooms.id)
#
require 'rails_helper'

RSpec.describe CanvasClassroom, type: :model do
  subject { create(:canvas_classroom) }

  it { should be_valid }

  it { should belong_to(:classroom) }
  it { should belong_to(:canvas_instance) }

  describe '#classroom_external_id' do
    let(:canvas_classroom) { create(:canvas_classroom) }
    let(:canvas_instance_id) { canvas_classroom.canvas_instance_id }
    let(:external_id) { canvas_classroom.external_id }

    subject { canvas_classroom.classroom_external_id }


    it { is_expected.to eq [canvas_instance_id, external_id].join(':') }
  end

  describe '.build_classroom_external_id' do
    subject { described_class.build_classroom_external_id(canvas_instance_id, external_id) }

    let(:canvas_instance_id) { Faker::Number.number }
    let(:external_id) { Faker::Number.number }

    it { is_expected.to eq [canvas_instance_id, external_id].join(':') }

    it 'has .unpack_classroom_external_id! is its inverse' do
      expect(described_class.unpack_classroom_external_id!(subject)).to eq [canvas_instance_id, external_id]
    end
  end

  describe '.custom_find_by_classroom_external_id' do
    subject { described_class.custom_find_by_classroom_external_id(classroom_external_id) }

    context 'invalid classroom_external_id format' do
      let(:classroom_external_id) { nil }

      it { is_expected.to be_nil }
    end

    context 'valid classroom_external_id' do
      let(:classroom_external_id) { described_class.build_classroom_external_id(canvas_instance_id, external_id) }

      context 'canvas_instance does not exist' do
        let(:canvas_instance_id) { Faker::Number.number }
        let(:external_id) { Faker::Number.number }

        it { is_expected.to be_nil }
      end

      context 'canvas_instance exists' do
        let(:canvas_instance_id) { create(:canvas_instance).id }

        context 'canvas_classroom exists' do
          let!(:canvas_classroom) { create(:canvas_classroom, canvas_instance_id: canvas_instance_id) }
          let(:external_id) { canvas_classroom.external_id }

          it { is_expected.to eq canvas_classroom }
        end

        context 'canvas_classroom does notexist' do
          let(:external_id) { Faker::Number.number }

          it { is_expected.to be_nil}
        end
      end
    end
  end

  describe '.unpack_classroom_external_id!' do
    subject { described_class.unpack_classroom_external_id!(classroom_external_id) }

    let(:classroom_external_id) { '1:2' }

    it { is_expected.to eq ['1', '2'] }

    it 'has .build_classroom_external_id as its inverse' do
      expect(described_class.build_classroom_external_id(*subject)).to eq classroom_external_id
    end

    context 'invalid classroom_external_id format' do
      let(:classroom_external_id) { nil }

      it { expect { subject }.to raise_error(described_class::InvalidClassroomExternalIdFormatError) }
    end
  end

  describe '.valid_classroom_external_id_format?' do
    subject { described_class.valid_classroom_external_id_format?(classroom_external_id) }

    context 'invalid classroom_external_id format' do
      context 'nil classroom_external_id' do
        let(:classroom_external_id) { nil }

        it { is_expected.to be_falsey }
      end

      context 'empty classroom_external_id' do
        let(:classroom_external_id) { '' }

        it { is_expected.to be false }
      end

      context 'no semicolon' do
        let(:classroom_external_id) { 'invalid' }

        it { is_expected.to be false }
      end

      context 'multiple semicolons' do
        let(:classroom_external_id) { '1:2:3' }

        it { is_expected.to be false }
      end

      context 'missing canvas_instance_id' do
        let(:classroom_external_id) { ':1' }

        it { is_expected.to be false }
      end

      context 'missing external_id' do
        let(:classroom_external_id) { '1:' }

        it { is_expected.to be false }
      end

      context 'missing canvas_instance_id and external_id' do
        let(:classroom_external_id) { ':' }

        it { is_expected.to be false }
      end
    end

    context 'valid classroom_external_id' do
      let(:classroom_external_id) { '1:2' }

      it { is_expected.to be true }
    end
  end
end
