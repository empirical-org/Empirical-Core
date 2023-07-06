# frozen_string_literal: true

require 'rails_helper'

module QuillBigQuery
  describe SchoolsContainingXTeachersQuery do
    context 'for schools all time', :big_query_snapshot do
      include_context 'QuillBigQuery TestRunner Setup'

      let(:schools) { create_list(:school, 10) }
      let(:chosen_school_1) { create(:school) }
      let(:chosen_school_2) { create(:school) }
      let(:teacher) { create(:teacher) }
      let(:schools_user) { create(:schools_users, user: teacher, school: chosen_school_1) }
      let(:second_teacher) { create(:teacher) }
      let(:schools_user_2) { create(:schools_users, user: second_teacher, school: chosen_school_2) }

      let(:query_args) { [{teacher_ids: [teacher.id, second_teacher.id]}] }
      let(:cte_records) {
        [
          schools,
          chosen_school_1,
          chosen_school_2,
          teacher,
          second_teacher,
          schools_user,
          schools_user_2
        ]
      }

      it { expect(results).to match_array([chosen_school_1, chosen_school_2].map{ |s| {"free_lunches" => s.free_lunches, "id" => s.id}}) }
    end
  end
end
