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

ActiveRecord::Schema.define(version: 20150318220008) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"

  create_table "activities", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "uid",                                     null: false
    t.hstore   "data"
    t.integer  "activity_classification_id"
    t.integer  "topic_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "flags",                      default: [], null: false, array: true
  end

  add_index "activities", ["activity_classification_id"], name: "index_activities_on_activity_classification_id", using: :btree
  add_index "activities", ["topic_id"], name: "index_activities_on_topic_id", using: :btree
  add_index "activities", ["uid"], name: "index_activities_on_uid", unique: true, using: :btree

  create_table "activity_classifications", force: true do |t|
    t.string   "name"
    t.string   "key",        null: false
    t.string   "form_url"
    t.string   "uid",        null: false
    t.string   "module_url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "app_name"
  end

  add_index "activity_classifications", ["key"], name: "index_activity_classifications_on_key", unique: true, using: :btree
  add_index "activity_classifications", ["uid"], name: "index_activity_classifications_on_uid", unique: true, using: :btree

  create_table "activity_sessions", force: true do |t|
    t.integer  "classroom_activity_id"
    t.integer  "activity_id"
    t.integer  "user_id"
    t.string   "pairing_id"
    t.float    "percentage"
    t.string   "state",                 default: "unstarted", null: false
    t.integer  "time_spent"
    t.datetime "completed_at"
    t.string   "uid"
    t.boolean  "temporary",             default: false
    t.hstore   "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "started_at"
    t.boolean  "is_retry",              default: false
    t.boolean  "is_final_score",        default: false
  end

  add_index "activity_sessions", ["activity_id"], name: "index_activity_sessions_on_activity_id", using: :btree
  add_index "activity_sessions", ["classroom_activity_id"], name: "index_activity_sessions_on_classroom_activity_id", using: :btree
  add_index "activity_sessions", ["completed_at"], name: "index_activity_sessions_on_completed_at", using: :btree
  add_index "activity_sessions", ["pairing_id"], name: "index_activity_sessions_on_pairing_id", using: :btree
  add_index "activity_sessions", ["started_at"], name: "index_activity_sessions_on_started_at", using: :btree
  add_index "activity_sessions", ["state"], name: "index_activity_sessions_on_state", using: :btree
  add_index "activity_sessions", ["uid"], name: "index_activity_sessions_on_uid", unique: true, using: :btree
  add_index "activity_sessions", ["user_id"], name: "index_activity_sessions_on_user_id", using: :btree

  create_table "activity_time_entries", force: true do |t|
    t.integer  "activity_session_id"
    t.datetime "started_at"
    t.datetime "ended_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activity_time_entries", ["activity_session_id"], name: "index_activity_time_entries_on_activity_session_id", using: :btree

  create_table "assessments", force: true do |t|
    t.text     "body"
    t.integer  "chapter_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "instructions"
  end

  create_table "categories", force: true do |t|
    t.text     "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "chapter_levels", force: true do |t|
    t.string   "name"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "workbook_id"
  end

  create_table "chapters", force: true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "workbook_id"
    t.text     "article_header"
    t.text     "rule_position"
    t.text     "description"
    t.text     "practice_description"
    t.integer  "chapter_level_id"
  end

  add_index "chapters", ["chapter_level_id"], name: "index_chapters_on_chapter_level_id", using: :btree

  create_table "classroom_activities", force: true do |t|
    t.integer  "classroom_id"
    t.integer  "activity_id"
    t.integer  "unit_id"
    t.datetime "due_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assigned_student_ids", array: true
  end

  add_index "classroom_activities", ["activity_id"], name: "index_classroom_activities_on_activity_id", using: :btree
  add_index "classroom_activities", ["classroom_id"], name: "index_classroom_activities_on_classroom_id", using: :btree
  add_index "classroom_activities", ["unit_id"], name: "index_classroom_activities_on_unit_id", using: :btree

  create_table "classroom_chapters", force: true do |t|
    t.string   "classcode"
    t.integer  "chapter_id"
    t.datetime "due_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "temporary",    default: false, null: false
    t.integer  "classroom_id"
  end

  create_table "classrooms", force: true do |t|
    t.string   "name"
    t.string   "code"
    t.integer  "teacher_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "clever_id"
    t.string   "grade"
  end

  add_index "classrooms", ["code"], name: "index_classrooms_on_code", using: :btree
  add_index "classrooms", ["grade"], name: "index_classrooms_on_grade", using: :btree

  create_table "concept_categories", force: true do |t|
    t.string   "name"
    t.integer  "concept_class_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "concept_classes", force: true do |t|
    t.string "name"
  end

  create_table "concept_tag_results", force: true do |t|
    t.integer "activity_session_id"
    t.integer "concept_tag_id",      null: false
    t.json    "metadata"
    t.integer "concept_category_id"
  end

  create_table "concept_tags", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "concept_class_id",    null: false
    t.string   "additional_concepts"
  end

  create_table "csv_exports", force: true do |t|
    t.string   "export_type"
    t.datetime "emailed_at"
    t.json     "filters"
    t.integer  "teacher_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "csv_file"
  end

  create_table "districts", force: true do |t|
    t.string   "clever_id"
    t.string   "name"
    t.string   "token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "districts_users", id: false, force: true do |t|
    t.integer "district_id"
    t.integer "user_id"
  end

  add_index "districts_users", ["district_id", "user_id"], name: "index_districts_users_on_district_id_and_user_id", using: :btree
  add_index "districts_users", ["district_id"], name: "index_districts_users_on_district_id", using: :btree
  add_index "districts_users", ["user_id"], name: "index_districts_users_on_user_id", using: :btree

  create_table "file_uploads", force: true do |t|
    t.string   "name"
    t.string   "file"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "grammar_rules", force: true do |t|
    t.string   "identifier"
    t.text     "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "practice_lesson"
    t.integer  "author_id"
  end

  create_table "grammar_tests", force: true do |t|
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "homepage_news_slides", force: true do |t|
    t.string   "link"
    t.integer  "position"
    t.string   "image"
    t.text     "text"
    t.integer  "author_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "oauth_access_grants", force: true do |t|
    t.integer  "resource_owner_id", null: false
    t.integer  "application_id",    null: false
    t.string   "token",             null: false
    t.integer  "expires_in",        null: false
    t.text     "redirect_uri",      null: false
    t.datetime "created_at",        null: false
    t.datetime "revoked_at"
    t.string   "scopes"
  end

  add_index "oauth_access_grants", ["token"], name: "index_oauth_access_grants_on_token", unique: true, using: :btree

  create_table "oauth_access_tokens", force: true do |t|
    t.integer  "resource_owner_id"
    t.integer  "application_id"
    t.string   "token",             null: false
    t.string   "refresh_token"
    t.integer  "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at",        null: false
    t.string   "scopes"
  end

  add_index "oauth_access_tokens", ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true, using: :btree
  add_index "oauth_access_tokens", ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id", using: :btree
  add_index "oauth_access_tokens", ["token"], name: "index_oauth_access_tokens_on_token", unique: true, using: :btree

  create_table "oauth_applications", force: true do |t|
    t.string   "name",         null: false
    t.string   "uid",          null: false
    t.string   "secret",       null: false
    t.text     "redirect_uri", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "oauth_applications", ["uid"], name: "index_oauth_applications_on_uid", unique: true, using: :btree

  create_table "page_areas", force: true do |t|
    t.string   "name"
    t.string   "description"
    t.text     "content"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rule_examples", force: true do |t|
    t.text     "title"
    t.boolean  "correct",    default: false, null: false
    t.text     "text"
    t.integer  "rule_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rule_question_inputs", force: true do |t|
    t.string   "step"
    t.integer  "rule_question_id"
    t.integer  "score_id"
    t.text     "first_input"
    t.text     "second_input"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "activity_session_id"
  end

  add_index "rule_question_inputs", ["activity_session_id"], name: "index_rule_question_inputs_on_activity_session_id", using: :btree
  add_index "rule_question_inputs", ["rule_question_id"], name: "index_rule_question_inputs_on_rule_question_id", using: :btree
  add_index "rule_question_inputs", ["step"], name: "index_rule_question_inputs_on_step", using: :btree

  create_table "rule_questions", force: true do |t|
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "rule_id"
    t.text     "prompt"
    t.text     "instructions"
    t.text     "hint"
  end

  create_table "rules", force: true do |t|
    t.text     "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "category_id"
    t.integer  "workbook_id",    default: 1
    t.text     "description"
    t.string   "classification"
    t.string   "uid"
    t.string   "flags",          default: [], null: false, array: true
  end

  add_index "rules", ["uid"], name: "index_rules_on_uid", unique: true, using: :btree

  create_table "schools", force: true do |t|
    t.string   "nces_id"
    t.string   "lea_id"
    t.string   "leanm"
    t.string   "name"
    t.string   "phone"
    t.string   "mail_street"
    t.string   "mail_city"
    t.string   "mail_state"
    t.string   "mail_zipcode"
    t.string   "street"
    t.string   "city"
    t.string   "state"
    t.string   "zipcode"
    t.string   "nces_type_code"
    t.string   "nces_status_code"
    t.string   "magnet"
    t.string   "charter"
    t.string   "ethnic_group"
    t.decimal  "longitude",             precision: 9, scale: 6
    t.decimal  "latitude",              precision: 9, scale: 6
    t.integer  "ulocal"
    t.integer  "fte_classroom_teacher"
    t.integer  "lower_grade"
    t.integer  "upper_grade"
    t.integer  "school_level"
    t.integer  "free_lunches"
    t.integer  "total_students"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "clever_id"
  end

  add_index "schools", ["name"], name: "index_schools_on_name", using: :btree
  add_index "schools", ["nces_id"], name: "index_schools_on_nces_id", using: :btree
  add_index "schools", ["state"], name: "index_schools_on_state", using: :btree
  add_index "schools", ["zipcode"], name: "index_schools_on_zipcode", using: :btree

  create_table "schools_users", id: false, force: true do |t|
    t.integer "school_id"
    t.integer "user_id"
  end

  add_index "schools_users", ["school_id", "user_id"], name: "index_schools_users_on_school_id_and_user_id", using: :btree
  add_index "schools_users", ["school_id"], name: "index_schools_users_on_school_id", using: :btree
  add_index "schools_users", ["user_id"], name: "index_schools_users_on_user_id", using: :btree

  create_table "scores", force: true do |t|
    t.integer  "user_id"
    t.integer  "classroom_chapter_id"
    t.datetime "completion_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "missed_rules"
    t.string   "state",                default: "unstarted", null: false
    t.text     "story_step_input"
    t.float    "grade"
  end

  create_table "sections", force: true do |t|
    t.string   "name"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "workbook_id"
  end

  create_table "topic_categories", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "topic_categories", ["name"], name: "index_topic_categories_on_name", using: :btree

  create_table "topics", force: true do |t|
    t.string   "name"
    t.integer  "section_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "topic_category_id"
  end

  add_index "topics", ["topic_category_id"], name: "index_topics_on_topic_category_id", using: :btree

  create_table "units", force: true do |t|
    t.string   "name"
    t.integer  "classroom_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "role",            default: "user"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "classcode"
    t.boolean  "active",          default: false
    t.string   "username"
    t.string   "token"
    t.inet     "ip_address"
    t.string   "clever_id"
  end

  add_index "users", ["active"], name: "index_users_on_active", using: :btree
  add_index "users", ["classcode"], name: "index_users_on_classcode", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", using: :btree
  add_index "users", ["role"], name: "index_users_on_role", using: :btree
  add_index "users", ["token"], name: "index_users_on_token", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", using: :btree

  create_table "workbooks", force: true do |t|
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
