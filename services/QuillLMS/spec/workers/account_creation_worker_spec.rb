# frozen_string_literal: true

require 'rails_helper'

describe AccountCreationWorker do
  let(:analyzer) { double(:analyzer, track_chain: true, track_with_attributes: true) }

  subject { described_class.new }

  before { allow(Analyzer).to receive(:new) { analyzer } }

  describe '#perform' do
    context 'when user is a teacher' do
      context 'when send newsletter is false' do
        let!(:teacher) { create(:teacher, send_newsletter: false) }

        it 'should track the account creation' do
          expect(analyzer).to receive(:track_chain).with(
              teacher,
              [SegmentIo::BackgroundEvents::TEACHER_ACCOUNT_CREATION]
          )
          subject.perform(teacher.id)
        end
      end

      context 'when send newsletter' do
        let!(:teacher) { create(:teacher, send_newsletter: true) }

        it 'should track the creation and sign up for newsletter' do
          expect(analyzer).to receive(:track_chain).with(
              teacher,
              [
                SegmentIo::BackgroundEvents::TEACHER_ACCOUNT_CREATION,
                SegmentIo::BackgroundEvents::TEACHER_SIGNED_UP_FOR_NEWSLETTER
              ]
          )
          subject.perform(teacher.id)
        end
      end
    end
  end
end
