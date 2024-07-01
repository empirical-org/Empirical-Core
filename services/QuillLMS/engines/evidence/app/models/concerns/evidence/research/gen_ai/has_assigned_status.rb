# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      module HasAssignedStatus
        extend ActiveSupport::Concern

        ASSIGNED_STATUSES = [
          OPTIMAL = 'optimal',
          SUBOPTIMAL = 'suboptimal'
        ]

        included do
          scope :optimal, -> { where(assigned_status_column => OPTIMAL) }
          scope :suboptimal, -> { where(assigned_status_column => SUBOPTIMAL) }
        end

        def self.assigned_status_column
          raise NotImplementedError, 'Must implement assigned_status_column'
        end

        def assigned_status_column = self.class.assigned_status_column
        def optimal? = send(assigned_status_column) == OPTIMAL
        def suboptimal? = send(assigned_status_column) == SUBOPTIMAL
      end
    end
  end
end
