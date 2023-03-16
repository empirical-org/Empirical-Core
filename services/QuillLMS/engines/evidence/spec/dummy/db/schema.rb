# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_03_06_215624) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", id: :serial, force: :cascade do |t|
    t.string "name"
    t.integer "activity_classification_id"
    t.string "flags", default: [], null: false, array: true
  end

  create_table "activity_classifications", id: :serial, force: :cascade do |t|
    t.string "key"
  end

  create_table "change_logs", id: :serial, force: :cascade do |t|
    t.text "explanation"
    t.string "action", null: false
    t.integer "changed_record_id", null: false
    t.string "changed_record_type", null: false
    t.integer "user_id"
    t.string "changed_attribute"
    t.string "previous_value"
    t.string "new_value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["changed_record_id"], name: "index_change_logs_on_changed_record_id"
    t.index ["user_id"], name: "index_change_logs_on_user_id"
  end

  create_table "comprehension_activities", id: :serial, force: :cascade do |t|
    t.string "title", limit: 100
    t.integer "parent_activity_id"
    t.integer "target_level", limit: 2
    t.string "scored_level", limit: 100
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "notes"
    t.integer "version", limit: 2, default: 1, null: false
    t.index ["parent_activity_id"], name: "index_comprehension_activities_on_parent_activity_id"
  end

  create_table "comprehension_automl_models", id: :serial, force: :cascade do |t|
    t.string "automl_model_id", null: false
    t.string "name", null: false
    t.string "labels", default: [], array: true
    t.integer "prompt_id"
    t.string "state", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "notes", default: ""
  end

  create_table "comprehension_feedbacks", id: :serial, force: :cascade do |t|
    t.integer "rule_id", null: false
    t.string "text", null: false
    t.string "description"
    t.integer "order", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["rule_id", "order"], name: "index_comprehension_feedbacks_on_rule_id_and_order", unique: true
  end

  create_table "comprehension_highlights", id: :serial, force: :cascade do |t|
    t.integer "feedback_id", null: false
    t.string "text", null: false
    t.string "highlight_type", null: false
    t.integer "starting_index"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comprehension_labels", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.integer "rule_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comprehension_passages", id: :serial, force: :cascade do |t|
    t.integer "activity_id"
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image_link"
    t.string "image_alt_text", default: ""
    t.string "highlight_prompt"
    t.text "image_caption", default: ""
    t.text "image_attribution", default: ""
    t.string "essential_knowledge_text", default: ""
    t.index ["activity_id"], name: "index_comprehension_passages_on_activity_id"
  end

  create_table "comprehension_plagiarism_texts", id: :serial, force: :cascade do |t|
    t.integer "rule_id", null: false
    t.string "text", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["rule_id"], name: "index_comprehension_plagiarism_texts_on_rule_id"
  end

  create_table "comprehension_prompts", id: :serial, force: :cascade do |t|
    t.integer "activity_id"
    t.integer "max_attempts", limit: 2
    t.string "conjunction", limit: 20
    t.string "text"
    t.text "max_attempts_feedback"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_strong_example", default: ""
    t.string "second_strong_example", default: ""
    t.index ["activity_id"], name: "index_comprehension_prompts_on_activity_id"
  end

  create_table "comprehension_prompts_rules", id: :serial, force: :cascade do |t|
    t.integer "prompt_id", null: false
    t.integer "rule_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["prompt_id", "rule_id"], name: "index_comprehension_prompts_rules_on_prompt_id_and_rule_id", unique: true
    t.index ["rule_id"], name: "index_comprehension_prompts_rules_on_rule_id"
  end

  create_table "comprehension_regex_rules", id: :serial, force: :cascade do |t|
    t.string "regex_text", limit: 200, null: false
    t.boolean "case_sensitive", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "rule_id"
    t.text "sequence_type", default: "incorrect", null: false
    t.boolean "conditional", default: false
    t.index ["rule_id"], name: "index_comprehension_regex_rules_on_rule_id"
  end

  create_table "comprehension_rules", id: :serial, force: :cascade do |t|
    t.string "uid", null: false
    t.string "name", null: false
    t.string "note"
    t.boolean "universal", null: false
    t.string "rule_type", null: false
    t.boolean "optimal", null: false
    t.integer "suborder"
    t.string "concept_uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "state", null: false
    t.bigint "hint_id"
    t.index ["hint_id"], name: "index_comprehension_rules_on_hint_id"
    t.index ["uid"], name: "index_comprehension_rules_on_uid", unique: true
  end

  create_table "comprehension_turking_round_activity_sessions", id: :serial, force: :cascade do |t|
    t.integer "turking_round_id"
    t.string "activity_session_uid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_session_uid"], name: "comprehension_turking_sessions_activity_uid", unique: true
    t.index ["turking_round_id"], name: "comprehension_turking_sessions_turking_id"
  end

  create_table "comprehension_turking_rounds", id: :serial, force: :cascade do |t|
    t.integer "activity_id"
    t.uuid "uuid"
    t.datetime "expires_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_id"], name: "index_comprehension_turking_rounds_on_activity_id"
    t.index ["uuid"], name: "index_comprehension_turking_rounds_on_uuid", unique: true
  end

  create_table "evidence_activity_healths", force: :cascade do |t|
    t.string "name", null: false
    t.string "flag", null: false
    t.integer "activity_id", null: false
    t.integer "version", null: false
    t.integer "version_plays", null: false
    t.integer "total_plays", null: false
    t.integer "completion_rate"
    t.integer "because_final_optimal"
    t.integer "but_final_optimal"
    t.integer "so_final_optimal"
    t.integer "avg_completion_time"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "evidence_hints", force: :cascade do |t|
    t.string "explanation", null: false
    t.string "image_link", null: false
    t.string "image_alt_text", null: false
    t.bigint "rule_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "name"
    t.index ["rule_id"], name: "index_evidence_hints_on_rule_id"
  end

  create_table "evidence_prompt_healths", force: :cascade do |t|
    t.integer "prompt_id", null: false
    t.string "activity_short_name", null: false
    t.string "text", null: false
    t.integer "current_version", null: false
    t.integer "version_responses", null: false
    t.integer "first_attempt_optimal"
    t.integer "final_attempt_optimal"
    t.float "avg_attempts"
    t.float "confidence"
    t.integer "percent_automl_consecutive_repeated"
    t.integer "percent_automl"
    t.integer "percent_plagiarism"
    t.integer "percent_opinion"
    t.integer "percent_grammar"
    t.integer "percent_spelling"
    t.integer "avg_time_spent_per_prompt"
    t.bigint "evidence_activity_health_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["evidence_activity_health_id"], name: "index_evidence_prompt_healths_on_evidence_activity_health_id"
  end

  create_table "evidence_prompt_text_batches", force: :cascade do |t|
    t.string "type", null: false
    t.integer "prompt_id", null: false
    t.integer "user_id", null: false
    t.string "file"
    t.jsonb "metadata"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "evidence_prompt_texts", force: :cascade do |t|
    t.integer "prompt_text_batch_id", null: false
    t.integer "text_generation_id", null: false
    t.string "text", null: false
    t.string "label"
    t.string "ml_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "evidence_text_generations", force: :cascade do |t|
    t.string "name", null: false
    t.jsonb "data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "name"
  end

  add_foreign_key "comprehension_automl_models", "comprehension_prompts", column: "prompt_id"
  add_foreign_key "comprehension_highlights", "comprehension_feedbacks", column: "feedback_id", on_delete: :cascade
  add_foreign_key "comprehension_labels", "comprehension_rules", column: "rule_id", on_delete: :cascade
  add_foreign_key "comprehension_plagiarism_texts", "comprehension_rules", column: "rule_id", on_delete: :cascade
  add_foreign_key "comprehension_regex_rules", "comprehension_rules", column: "rule_id", on_delete: :cascade
  add_foreign_key "evidence_prompt_healths", "evidence_activity_healths", on_delete: :cascade
end
