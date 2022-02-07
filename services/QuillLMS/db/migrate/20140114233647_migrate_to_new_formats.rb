# frozen_string_literal: true

class MigrateToNewFormats < ActiveRecord::Migration[4.2]
  def change
    create_table :activity_classifications, force: true do |t|
      t.string :name
      t.string :key, null: false
      t.string :form_url
      t.string :uid, null: false
      t.string :module_url

      t.index :uid, unique: true
      t.index :key, unique: true

      t.timestamps
    end

    create_table :activities, force: true do |t|
      t.string :name
      t.text :description
      t.string :uid, null: false
      t.hstore :data
      t.belongs_to :activity_classification
      t.belongs_to :topic

      t.index :uid, unique: true

      t.timestamps
    end

    create_table :topics, force: true do |t|
      t.string :name
      t.belongs_to :section

      t.timestamps
    end

    create_table :classroom_activities, force: true do |t|
      t.belongs_to :classroom
      t.belongs_to :activity
      t.belongs_to :unit
      t.datetime :due_date

      t.timestamps
    end

    create_table :activity_sessions, force: true do |t|
      t.belongs_to :classroom_activity
      t.belongs_to :activity
      t.belongs_to :user

      t.string :pairing_id
      t.float :percentage
      t.string :state, default: 'unstarted', null: false
      t.timestamp :completed_at
      t.integer :time_spent
      t.string :uid
      t.boolean :temporary

      t.hstore :data
      t.index :pairing_id
      t.index :uid, unique: true

      t.timestamps
    end

    remove_column :scores, :practice_step_input, :text
    remove_column :scores, :review_step_input, :text
    remove_column :scores, :items_missed, :integer
    remove_column :scores, :lessons_completed, :integer
    remove_column :scores, :score_values, :text

    execute 'DROP TABLE IF EXISTS sections'
    execute 'DROP SEQUENCE IF EXISTS sections CASCADE'
    execute 'DROP SEQUENCE IF EXISTS sections_id_seq CASCADE'

    rename_table :chapter_levels, :sections

    change_table :sections do |t|
      t.belongs_to :workbook
    end

    change_table :rule_question_inputs do |t|
      t.string :activity_session_id
    end

    create_table :units, force: true do |t|
      t.string :name
      t.belongs_to :classroom
    end
  end
end
