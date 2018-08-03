require 'rails_helper'

describe AccountCreationWorker do
  let(:subject) { described_class.new }
  let(:analyzer) { double(:analyzer, track_chain: true, track_with_attributes: true) }

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  describe '#perform' do
    context 'when user is a student' do
      let!(:student) { create(:student) }

      it 'should track student account creation' do
        expect(analyzer).to receive(:track_with_attributes).with(
          student,
          SegmentIo::Events::STUDENT_ACCOUNT_CREATION,
          {
            context: {:ip => student.ip_address },
            integrations: { intercom: 'false' }
          }
        )
        subject.perform(student.id)
      end
    end

    context 'when user is a teacher' do
      context 'when send newsletter is false' do
        let!(:teacher) { create(:teacher, send_newsletter: false) }

        it 'should track the account creation' do
          expect(analyzer).to receive(:track_chain).with(
              teacher,
              [SegmentIo::Events::STUDENT_ACCOUNT_CREATION]
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
                SegmentIo::Events::STUDENT_ACCOUNT_CREATION,
                SegmentIo::Events::TEACHER_SIGNED_UP_FOR_NEWSLETTER
              ]
          )
          subject.perform(teacher.id)
        end
      end
    end
  end
end