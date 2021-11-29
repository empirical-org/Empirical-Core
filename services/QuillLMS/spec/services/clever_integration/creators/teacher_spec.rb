# frozen_string_literal: true

require 'rails_helper'

describe CleverIntegration::Creators::Teacher do
  context 'linking a clever_id to an existing teacher' do
    let(:segment_event) { 'TEACHER_GOOGLE_AND_CLEVER' }
    let(:analyzer) { double(:analyzer) }

    before { allow(SegmentAnalytics).to receive(:new) { analyzer } }

    let!(:teacher) { create(:teacher, google_id: google_id) }

    let(:clever_id) { '456' }
    let(:clever_teacher_data) do
      {
        clever_id: clever_id,
        email: teacher.email,
        name: 'John Smith',
        username: 'username'
      }
    end

    context 'with no google_id' do
      let(:google_id) { nil }

      it 'does not trigger a segment event for dual clever and google link' do
        expect(analyzer).not_to receive(:track_event_from_string).with(segment_event, teacher.id)
        CleverIntegration::Creators::Teacher.run(clever_teacher_data)
      end
    end

    context 'with an existing google_id' do
      let(:google_id) { '123' }

      it 'sets google_id to nil and triggers a segment event for dual clever and google linking' do
        expect(analyzer).to receive(:track_event_from_string).with(segment_event, teacher.id)
        CleverIntegration::Creators::Teacher.run(clever_teacher_data)

        expect(teacher.reload.google_id).to be_nil
      end
    end
  end
end
