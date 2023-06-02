# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActiveClassroomsQuery do
    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Count CTE'

      it { expect(results).to eq(count: num_classrooms) }
    end
  end
end
