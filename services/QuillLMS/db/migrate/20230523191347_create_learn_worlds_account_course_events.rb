# frozen_string_literal: true

class CreateLearnWorldsAccountCourseEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :learn_worlds_account_course_events do |t|
      t.references :learn_worlds_account,
        foreign_key: true,
        null: false,
        index: { name: 'learn_worlds_account_course_events_on_account_id' }

      t.references :learn_worlds_course,
        foreign_key: true,
        null: false,
        index: { name: 'learn_worlds_account_course_events_on_course_id'}

      t.string :event_type, null: false

      t.timestamps
    end
  end
end
