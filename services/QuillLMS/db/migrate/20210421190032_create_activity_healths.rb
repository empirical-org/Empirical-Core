class CreateActivityHealths < ActiveRecord::Migration
  def change
    create_table :activity_healths do |t|
      t.string               :name
      t.string               :url
      t.string               :activity_categories, array: true
      t.string               :content_partners, array: true
      t.string               :tool
      t.integer              :recent_assignments
      t.string               :diagnostics, array: true
      t.string               :activity_packs, array: true
      t.time                 :avg_completion_time
      t.float                :avg_difficulty
      t.float                :avg_common_unmatched
      t.float                :standard_dev_difficulty
    end
  end
end
