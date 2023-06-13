# frozen_string_literal: true

require 'rails_helper'

module Snapshots
  describe ActiveTeachersQuery do
    context 'big_query_snapshot', :big_query_snapshot do
      include_context 'Snapshots Period CTE'


      let(:runner_context) do
        [
          classrooms,
          teachers,
          classrooms_teachers,
          schools_users,
          schools
        ]
      end

      context 'with current user_logins for all users' do
        let(:user_logins) { teachers.map { |teacher| create(:user_login, user: teacher) } }
        let(:cte_records) { [runner_context, user_logins] }

        it { expect(results).to eq(count: teachers.length) }
      end

      context 'multiple valid user_logins for each user' do
        let(:user_logins) { teachers.map { |teacher| create_list(:user_login, 10, user: teacher) }.flatten }
        let(:cte_records) { [runner_context, user_logins] }

        it { expect(results).to eq(count: teachers.length) }
      end

      context 'with user_logins outside of timeframe' do
        let(:too_old) { create(:user_login, user: teachers.first, created_at: timeframe_start - 1.day) }
        let(:too_new) { create(:user_login, user: teachers.first, created_at: timeframe_end + 1.day) }
        let(:cte_records) { [runner_context, too_old, too_new] }

        it { expect(results).to eq(count: 0) }
      end
    end
  end
end
