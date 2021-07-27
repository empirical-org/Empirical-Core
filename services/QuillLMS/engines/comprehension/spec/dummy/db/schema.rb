# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20210722143752) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string  "name"
    t.integer "activity_classification_id"
    t.string  "flags",                      default: [], null: false, array: true
  end

  create_table "activity_classifications", force: :cascade do |t|
    t.string "key"
  end

  create_table "comprehension_activities", force: :cascade do |t|
    t.string   "title",              limit: 100
    t.integer  "parent_activity_id"
    t.integer  "target_level",       limit: 2
    t.string   "scored_level",       limit: 100
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "notes"
    t.index ["parent_activity_id"], name: "index_comprehension_activities_on_parent_activity_id", using: :btree
  end

  create_table "comprehension_automl_models", force: :cascade do |t|
    t.string   "automl_model_id",              null: false
    t.string   "name",                         null: false
    t.string   "labels",          default: [],              array: true
    t.integer  "prompt_id"
    t.string   "state",                        null: false
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.text     "notes",           default: ""
  end

  create_table "comprehension_feedbacks", force: :cascade do |t|
    t.integer  "rule_id",     null: false
    t.string   "text",        null: false
    t.string   "description"
    t.integer  "order",       null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["rule_id", "order"], name: "index_comprehension_feedbacks_on_rule_id_and_order", unique: true, using: :btree
  end

  create_table "comprehension_highlights", force: :cascade do |t|
    t.integer  "feedback_id",    null: false
    t.string   "text",           null: false
    t.string   "highlight_type", null: false
    t.integer  "starting_index"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "comprehension_labels", force: :cascade do |t|
    t.string   "name",       null: false
    t.integer  "rule_id",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comprehension_passages", force: :cascade do |t|
    t.integer  "activity_id"
    t.text     "text"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "image_link"
    t.string   "image_alt_text",   default: ""
    t.string   "highlight_prompt"
    t.index ["activity_id"], name: "index_comprehension_passages_on_activity_id", using: :btree
  end

  create_table "comprehension_plagiarism_texts", force: :cascade do |t|
    t.integer  "rule_id",    null: false
    t.string   "text",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["rule_id"], name: "index_comprehension_plagiarism_texts_on_rule_id", unique: true, using: :btree
  end

  create_table "comprehension_prompts", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "max_attempts",          limit: 2
    t.string   "conjunction",           limit: 20
    t.string   "text"
    t.text     "max_attempts_feedback"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.index ["activity_id"], name: "index_comprehension_prompts_on_activity_id", using: :btree
  end

  create_table "comprehension_prompts_rules", force: :cascade do |t|
    t.integer  "prompt_id",  null: false
    t.integer  "rule_id",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["prompt_id", "rule_id"], name: "index_comprehension_prompts_rules_on_prompt_id_and_rule_id", unique: true, using: :btree
    t.index ["rule_id"], name: "index_comprehension_prompts_rules_on_rule_id", using: :btree
  end

  create_table "comprehension_regex_rules", force: :cascade do |t|
    t.string   "regex_text",     limit: 200,                       null: false
    t.boolean  "case_sensitive",                                   null: false
    t.datetime "created_at",                                       null: false
    t.datetime "updated_at",                                       null: false
    t.integer  "rule_id"
    t.text     "sequence_type",              default: "incorrect", null: false
    t.index ["rule_id"], name: "index_comprehension_regex_rules_on_rule_id", using: :btree
  end

  create_table "comprehension_rules", force: :cascade do |t|
    t.string   "uid",         null: false
    t.string   "name",        null: false
    t.string   "note"
    t.boolean  "universal",   null: false
    t.string   "rule_type",   null: false
    t.boolean  "optimal",     null: false
    t.integer  "suborder"
    t.string   "concept_uid"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "state",       null: false
    t.index ["uid"], name: "index_comprehension_rules_on_uid", unique: true, using: :btree
  end

  create_table "comprehension_turking_round_activity_sessions", force: :cascade do |t|
    t.integer  "turking_round_id"
    t.string   "activity_session_uid"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.index ["activity_session_uid"], name: "comprehension_turking_sessions_activity_uid", unique: true, using: :btree
    t.index ["turking_round_id"], name: "comprehension_turking_sessions_turking_id", using: :btree
  end

  create_table "comprehension_turking_rounds", force: :cascade do |t|
    t.integer  "activity_id"
    t.uuid     "uuid"
    t.datetime "expires_at"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["activity_id"], name: "index_comprehension_turking_rounds_on_activity_id", using: :btree
    t.index ["uuid"], name: "index_comprehension_turking_rounds_on_uuid", unique: true, using: :btree
  end

  add_foreign_key "comprehension_automl_models", "comprehension_prompts", column: "prompt_id"
  add_foreign_key "comprehension_highlights", "comprehension_feedbacks", column: "feedback_id", on_delete: :cascade
  add_foreign_key "comprehension_labels", "comprehension_rules", column: "rule_id", on_delete: :cascade
  add_foreign_key "comprehension_plagiarism_texts", "comprehension_rules", column: "rule_id", on_delete: :cascade
  add_foreign_key "comprehension_regex_rules", "comprehension_rules", column: "rule_id", on_delete: :cascade
end
