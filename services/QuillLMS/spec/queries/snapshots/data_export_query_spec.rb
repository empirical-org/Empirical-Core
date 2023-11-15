# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe DataExportQuery do
    include_context 'Snapshots Period CTE'

    context 'big_query_snapshot', :big_query_snapshot do
      let(:num_classrooms) { 1 }
      let(:num_concepts) { 11 }

      let(:activity_category_activities) { create_list(:activity_category_activity, num_concepts) }
      let(:activity_categories) { activity_category_activities.map { |aca| aca.activity_category } }

      let(:students) { create_list(:user, 3, role: 'student')}

      let(:standards) { [ create(:standard) ] }
      let(:activity_classifications) { [create(:activity_classification)]}
      let(:activities) do
        create_list(
          :activity,
          2,
          activity_classification_id: activity_classifications.first.id,
          standard_id: standards.first.id
        )
      end

      let(:units) { Unit.all }

      let(:classroom_units) do
        classrooms.map do |classroom|
          create_list(:classroom_unit, num_concepts, classroom: classroom, assigned_student_ids: students.map(&:id))
        end.flatten
      end

      let(:activity_sessions) do
        classroom_units.map do |classroom_unit|
          create(
            :activity_session,
            classroom_unit: classroom_unit,
            timespent: rand(1..100),
            activity: activities.first,
            user: students.sample
          )
        end
      end
      # We have one activity connected to each concept.
      # We have a number of classroom_units equal to the number of concepts.
      # We want to assign one concept to all classroom_units, the next concept to all but one, the next to all but two, and so on so that each concept is used a different number of times.
      # let(:unit_activity_bundles) do
      #   classroom_units.map.with_index do |classroom_unit, classroom_unit_index|
      #     Array(0..(num_concepts - (1 + classroom_unit_index))).map do |target_activity_index|
      #       create(:unit_activity, activity: activities[target_activity_index], unit: classroom_unit.unit)
      #     end
      #   end
      # end

      let(:runner_context) {
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools,
          schools_users,
          classroom_units,
          activity_categories,
          activities,
          activity_category_activities,
          classroom_units,
          activity_classifications,
          activity_sessions,
          standards,
          units,
          students
        ]
      }

      let(:cte_records) { [runner_context] }

      context 'basic shape tests' do
        xit 'should have one row per activity session' do
          expect(results.map{|r| r[:activity_session_id] }.uniq).to eq(
            results.map{|r| r[:activity_session_id] }
          )
        end

        it 'each row contains the expected fields' do
          expected_fields = %i(
            student_name
            student_email
            completed_at
            activity_name
            activity_pack
            score
            timespent
            standard
            tool
            school_name
            classroom_grade
            teacher_name
            classroom_name
          )

          results.each do |row|
            expect(row.keys.to_set > expected_fields.to_set).to be true
          end
          #binding.pry
          puts "ROWS: #{results.count}"
        end

      end

      context 'classroom_units created outside of timeframe' do
        before do
          classroom_units.each { |cu| cu.update(created_at: timeframe_start - 1.day) }
        end

        xit { expect(results).to eq([]) }
      end
    end
  end
end
