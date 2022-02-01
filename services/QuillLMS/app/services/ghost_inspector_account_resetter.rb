# frozen_string_literal: true

class GhostInspectorAccountResetter < ApplicationService
  DEFAULT_GHOST_INSPECTOR_ACCOUNT_EMAIL = 'ghost_inspector_account_email@example.com'

  def run
    return unless ghost_inspector_account

    hide_units
  end

  private def ghost_inspector_account
    ghost_inspector_account_email && User.find_by(email: ghost_inspector_account_email)
  end

  private def ghost_inspector_account_email
    ENV.fetch('GHOST_INSPECTOR_ACCOUNT_EMAIL', DEFAULT_GHOST_INSPECTOR_ACCOUNT_EMAIL)
  end

  private def hide_units
    ghost_inspector_account.units.each do |unit|
      unit.update(visible: false)
      ArchiveUnitsClassroomUnitsWorker.perform_async(unit.id)
      ResetLessonCacheWorker.perform_async(ghost_inspector_account.id)
    end
  end
end
