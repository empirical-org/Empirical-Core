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

ActiveRecord::Schema.define(version: 20140204201027) do

  create_table "activities", force: true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "uid",                        null: false
    t.hstore   "data"
    t.integer  "activity_classification_id"
    t.integer  "topic_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "activities", ["uid"], name: "index_activities_on_uid", unique: true, using: :btree

  create_table "activity_classifications", force: true do |t|
    t.string   "name"
    t.string   "key",        null: false
    t.string   "form_url"
    t.string   "uid",        null: false
    t.string   "module_url"
    t.datetime "created_at"
    t.datetime "updated_at"
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
    t.boolean  "temporary"
    t.hstore   "data"
  end

  add_index "activity_sessions", ["pairing_id"], name: "index_activity_sessions_on_pairing_id", using: :btree
  add_index "activity_sessions", ["uid"], name: "index_activity_sessions_on_uid", unique: true, using: :btree

  create_table "assessments", force: true do |t|
    t.text     "body"
    t.integer  "chapter_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.text     "instructions"
  end

  create_table "categories", force: true do |t|
    t.text     "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
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

  create_table "classroom_chapters", force: true do |t|
    t.string   "classcode"
    t.integer  "chapter_id"
    t.datetime "due_date"
    t.datetime "created_at",                   null: false
    t.datetime "updated_at",                   null: false
    t.boolean  "temporary",    default: false, null: false
    t.integer  "classroom_id"
  end

  create_table "classrooms", force: true do |t|
    t.string   "name"
    t.string   "code"
    t.integer  "teacher_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", force: true do |t|
    t.string   "title"
    t.text     "body"
    t.integer  "user_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "ancestry"
    t.string   "reply_type"
    t.integer  "lecture_chapter_id"
  end

  add_index "comments", ["ancestry"], name: "index_comments_on_ancestry", using: :btree

  create_table "file_uploads", force: true do |t|
    t.string   "name"
    t.string   "file"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "grammar_rules", force: true do |t|
    t.string   "identifier"
    t.text     "description"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.text     "practice_lesson"
    t.integer  "author_id"
  end

  create_table "grammar_tests", force: true do |t|
    t.text     "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
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

  create_table "rule_questions", force: true do |t|
    t.text     "body"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.integer  "rule_id"
    t.text     "prompt"
    t.text     "instructions"
    t.text     "hint"
  end

  create_table "rules", force: true do |t|
    t.text     "title"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
    t.integer  "category_id"
    t.integer  "workbook_id",    default: 1
    t.text     "description"
    t.string   "classification"
  end

  create_table "rules_misseds", force: true do |t|
    t.integer  "rule_id"
    t.integer  "user_id"
    t.integer  "assessment_id"
    t.datetime "time_take"
    t.boolean  "missed"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "scores", force: true do |t|
    t.integer  "user_id"
    t.integer  "classroom_chapter_id"
    t.datetime "completion_date"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
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

  create_table "topics", force: true do |t|
    t.string   "name"
    t.integer  "section_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "units", force: true do |t|
    t.string  "name"
    t.integer "classroom_id"
  end

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "role",            default: "user"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.string   "classcode"
    t.boolean  "active",          default: false
    t.string   "username"
    t.string   "token"
  end

  create_table "workbooks", force: true do |t|
    t.string   "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
