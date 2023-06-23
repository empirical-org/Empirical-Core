# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe OptionsQuery do
    # This is basically ClassroomOptionsQuery
    let(:test_options_query) do
      Class.new(described_class) do
        def select_clause
          "SELECT DISTINCT classrooms.id, classrooms.name"
        end

        private def order_by_column
          "classrooms.name"
        end
      end
    end

    context 'external_api', :big_query_snapshot do
      include_context 'Snapshots Option CTE'

      let(:results) {test_options_query.run(**query_args, options: {runner: runner}) }
      # We want to ensure that a single admin is connected to all schools
      # `admin` is already the user associated with the first school, but not the others
      let(:additional_schools_admins) { schools[1..-1].map { |s| SchoolsAdmins.create(school: s, user: admin) } }

      let(:cte_records) {
        [
          classrooms,
          classrooms_teachers,
          schools,
          schools_users,
          schools_admins,
          additional_schools_admins,
          users
        ]
      }

      let(:sorted_classrooms) { classrooms.sort_by(&:name) }

      it { expect(results).to eq(sorted_classrooms.map { |c| { "id" => c.id, "name" => c.name } }) }

      context 'with school_id filter' do
        let(:query_args) { {admin_id: admin.id, school_ids: [schools.first.id]} }

        it { expect(results).to eq([{ "id" => classrooms.first.id, "name" => classrooms.first.name }]) }
      end

      context 'with grade filter' do
        before do
          classrooms.first.update(grade: "1")
          classrooms[1..-1].each { |c| c.update(grade: "2") }
        end

        let(:query_args) { {admin_id: admin.id, grades: [classrooms.first.grade]} }

        it { expect(results).to eq([{ "id" => classrooms.first.id, "name" => classrooms.first.name }]) }
      end

      context 'with teacher_id filter' do
        let(:query_args) { {admin_id: admin.id, teacher_ids: [teachers.first.id]} }

        it { expect(results).to eq([{ "id" => classrooms.first.id, "name" => classrooms.first.name }]) }
      end
    end
  end
end
