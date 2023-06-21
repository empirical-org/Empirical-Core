# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe TeachersOptionsQuery do
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

      let(:teacher) { teachers.first }

      it { expect(results).to eq [{ "id" => teacher.id, "name" => teacher.name }] }
    end
  end
end
