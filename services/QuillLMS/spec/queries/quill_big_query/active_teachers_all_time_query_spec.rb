# frozen_string_literal: true

require 'rails_helper'

module QuillBigQuery
  describe ActiveTeachersAllTimeQuery do
    context 'for active teachers all time', :big_query_snapshot do
      include_context 'Snapshots Activity Session Count CTE'

      let(:query_args) { [] }

      it { expect(results).to match_array([]) }
    end
  end
end
