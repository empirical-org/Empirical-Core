# frozen_string_literal: true

module VitallyIntegration
  class UnignoreActiveOrganizationsWorker
    include Sidekiq::Worker

    def perform
      active_districts.each.with_index do |district, index|
        UnignoreOrganizationWorker.perform_in(index.seconds, district.id)
      end
    end

    private def now = @now ||= DateTime.current
    private def active_start = now - 24.hours
    private def active_end = now

    private def active_districts
      District.joins(
        schools: {
          users: {
            classrooms_teachers: {
              classroom: {
                students_classrooms: :student
              }
            }
          }
        }
      ).where(
        # students_students_classroom is the alias that the above join generates for student records
        students_students_classrooms: {
          last_sign_in: active_start..active_end
        }
      ).distinct
    end
  end
end
