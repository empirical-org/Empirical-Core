# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe SchoolsOptionsQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Option CTE'

      let(:schools) { School.where(id: schools_users.pluck(:school_id)) }
      let(:cte_records) { option_query_cte_records << schools }

      let(:school) { schools.first }

      it { expect(results).to eq [{ "id" => school.id, "name" => school.name }] }
    end
  end
end
