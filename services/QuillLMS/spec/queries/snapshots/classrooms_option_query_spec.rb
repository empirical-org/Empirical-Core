# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ClassroomsOptionsQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Option CTE'

      let(:cte_records) {
        [
          classrooms,
          classrooms_teachers,
          schools,
          schools_users,
          schools_admins,
          users
        ]
      }

      let(:classroom) { classrooms.first }

      it { expect(results).to eq [{ "id" => classroom.id, "name" => classroom.name }] }
    end
  end
end
