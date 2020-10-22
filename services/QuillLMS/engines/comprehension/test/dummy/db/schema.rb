# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20201019200539) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comprehension_activities", force: :cascade do |t|
    t.string   "title",              limit: 100
    t.integer  "parent_activity_id"
    t.integer  "target_level",       limit: 2
    t.string   "scored_level",       limit: 100
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
  end

  add_index "comprehension_activities", ["parent_activity_id"], name: "index_comprehension_activities_on_parent_activity_id", using: :btree

  create_table "comprehension_feedback_histories", force: :cascade do |t|
    t.text     "activity_session_uid"
    t.integer  "prompt_id"
    t.string   "prompt_type"
    t.text     "concept_uid"
    t.integer  "attempt",              null: false
    t.text     "entry",                null: false
    t.boolean  "optimal",              null: false
    t.boolean  "used",                 null: false
    t.text     "feedback_text"
    t.text     "feedback_type",        null: false
    t.datetime "time",                 null: false
    t.jsonb    "metadata"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  add_index "comprehension_feedback_histories", ["activity_session_uid"], name: "index_comprehension_feedback_histories_on_activity_session_uid", using: :btree
  add_index "comprehension_feedback_histories", ["concept_uid"], name: "index_comprehension_feedback_histories_on_concept_uid", using: :btree
  add_index "comprehension_feedback_histories", ["prompt_type", "prompt_id"], name: "index_comprehension_feedback_histories_on_prompt_type_and_id", using: :btree

  create_table "comprehension_passages", force: :cascade do |t|
    t.integer  "activity_id"
    t.text     "text"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "comprehension_passages", ["activity_id"], name: "index_comprehension_passages_on_activity_id", using: :btree

  create_table "comprehension_prompts", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "max_attempts",          limit: 2
    t.string   "conjunction",           limit: 20
    t.string   "text"
    t.text     "max_attempts_feedback"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  add_index "comprehension_prompts", ["activity_id"], name: "index_comprehension_prompts_on_activity_id", using: :btree

  create_table "comprehension_prompts_rule_sets", force: :cascade do |t|
    t.integer "prompt_id"
    t.integer "rule_set_id"
  end

  add_index "comprehension_prompts_rule_sets", ["prompt_id"], name: "index_comprehension_prompts_rule_sets_on_prompt_id", using: :btree
  add_index "comprehension_prompts_rule_sets", ["rule_set_id"], name: "index_comprehension_prompts_rule_sets_on_rule_set_id", using: :btree

  create_table "comprehension_rule_sets", force: :cascade do |t|
    t.integer  "activity_id"
    t.integer  "prompt_id"
    t.string   "name",        limit: 100
    t.text     "feedback"
    t.integer  "priority",    limit: 2
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "comprehension_rule_sets", ["activity_id"], name: "index_comprehension_rule_sets_on_activity_id", using: :btree
  add_index "comprehension_rule_sets", ["prompt_id"], name: "index_comprehension_rule_sets_on_prompt_id", using: :btree

  create_table "comprehension_rules", force: :cascade do |t|
    t.integer  "rule_set_id"
    t.string   "regex_text",     limit: 200
    t.boolean  "case_sensitive"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  add_index "comprehension_rules", ["rule_set_id"], name: "index_comprehension_rules_on_rule_set_id", using: :btree

  create_table "comprehension_turking_rounds", force: :cascade do |t|
    t.integer  "activity_id"
    t.uuid     "uuid"
    t.datetime "expires_at"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "comprehension_turking_rounds", ["activity_id"], name: "index_comprehension_turking_rounds_on_activity_id", using: :btree
  add_index "comprehension_turking_rounds", ["uuid"], name: "index_comprehension_turking_rounds_on_uuid", unique: true, using: :btree

end
