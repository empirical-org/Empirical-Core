# frozen_string_literal: true

require 'rails_helper'

module QuillBigQuery
  describe SchoolsContainingCertainTeachersQuery do
    context 'for schools all time', :big_query_snapshot do
      include_context 'QuillBigQuery TestRunner Setup'

      let(:schools) { create_list(:school, 10) }
      let(:chosen_school_one) { create(:school) }
      let(:chosen_school_two) { create(:school) }
      let(:teacher) { create(:teacher) }
      let(:schools_user) { create(:schools_users, user: teacher, school: chosen_school_one) }
      let(:second_teacher) { create(:teacher) }
      let(:schools_user_two) { create(:schools_users, user: second_teacher, school: chosen_school_two) }

      let(:query_args) { [{teacher_ids: [teacher.id, second_teacher.id]}] }
      let(:cte_records) {
        [
          schools,
          chosen_school_one,
          chosen_school_two,
          teacher,
          second_teacher,
          schools_user,
          schools_user_two
        ]
      }

      it { expect(results).to match_array([chosen_school_one, chosen_school_two].map{ |s| {"free_lunches" => s.free_lunches, "id" => s.id}}) }
    end
  end
end
