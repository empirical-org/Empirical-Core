# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GhostInspectorAccountResetter do
  subject { described_class.run }

  let!(:ghost_inspector_account) { create(:user, email: described_class::DEFAULT_GHOST_INSPECTOR_ACCOUNT_EMAIL) }

  context 'no units associated with ghost_inspector account exist' do
    it 'does not reset anything' do
      expect(ArchiveUnitsClassroomUnitsWorker).not_to receive(:perform_async)
      expect(ResetLessonCacheWorker).not_to receive(:perform_async)
      subject
    end
  end

  context 'units associated with ghost_inspector account exist' do
    let!(:unit) { create(:unit, user: ghost_inspector_account) }

    it 'archives classroom units and resets lesson cache' do
      expect(ArchiveUnitsClassroomUnitsWorker).to receive(:perform_async).with(unit.id)
      expect(ResetLessonCacheWorker).to receive(:perform_async).with(ghost_inspector_account.id)
      subject

      expect(unit.reload.visible).to be false
    end
  end
end
