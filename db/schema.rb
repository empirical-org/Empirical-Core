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

ActiveRecord::Schema.define(version: 20160822145724) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"
  enable_extension "pg_stat_statements"

  create_table "activities", force: :cascade do |t|
    t.string   "name",                       limit: 255
    t.text     "description"
    t.string   "uid",                        limit: 255,                null: false
    t.hstore   "data"
    t.integer  "activity_classification_id"
    t.integer  "topic_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "flags",                      limit: 255, default: [],   null: false, array: true
    t.boolean  "repeatable",                             default: true
  end

  add_index "activities", ["activity_classification_id"], name: "index_activities_on_activity_classification_id", using: :btree
  add_index "activities", ["topic_id"], name: "index_activities_on_topic_id", using: :btree
  add_index "activities", ["uid"], name: "index_activities_on_uid", unique: true, using: :btree

  create_table "activities_unit_templates", id: false, force: :cascade do |t|
    t.integer "unit_template_id", null: false
    t.integer "activity_id",      null: false
  end

  add_index "activities_unit_templates", ["activity_id", "unit_template_id"], name: "aut", using: :btree
  add_index "activities_unit_templates", ["unit_template_id", "activity_id"], name: "uta", using: :btree

  create_table "activity_classifications", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "key",        limit: 255, null: false
    t.string   "form_url",   limit: 255
    t.string   "uid",        limit: 255, null: false
    t.string   "module_url", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "app_name",   limit: 255
  end

  add_index "activity_classifications", ["key"], name: "index_activity_classifications_on_key", unique: true, using: :btree
  add_index "activity_classifications", ["uid"], name: "index_activity_classifications_on_uid", unique: true, using: :btree

  create_table "activity_sessions", force: :cascade do |t|
    t.integer  "classroom_activity_id"
    t.integer  "activity_id"
    t.integer  "user_id"
    t.string   "pairing_id",            limit: 255
    t.float    "percentage"
    t.string   "state",                 limit: 255, default: "unstarted", null: false
    t.datetime "completed_at"
    t.string   "uid",                   limit: 255
    t.boolean  "temporary",                         default: false
    t.hstore   "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "started_at"
    t.boolean  "is_retry",                          default: false
    t.boolean  "is_final_score",                    default: false
    t.boolean  "visible",                           default: true,        null: false
  end

  add_index "activity_sessions", ["activity_id"], name: "index_activity_sessions_on_activity_id", using: :btree
  add_index "activity_sessions", ["classroom_activity_id"], name: "index_activity_sessions_on_classroom_activity_id", using: :btree
  add_index "activity_sessions", ["completed_at"], name: "index_activity_sessions_on_completed_at", using: :btree
  add_index "activity_sessions", ["pairing_id"], name: "index_activity_sessions_on_pairing_id", using: :btree
  add_index "activity_sessions", ["started_at"], name: "index_activity_sessions_on_started_at", using: :btree
  add_index "activity_sessions", ["state"], name: "index_activity_sessions_on_state", using: :btree
  add_index "activity_sessions", ["uid"], name: "index_activity_sessions_on_uid", unique: true, using: :btree
  add_index "activity_sessions", ["user_id"], name: "index_activity_sessions_on_user_id", using: :btree

  create_table "admin_accounts", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "name",       limit: 255
  end

  create_table "admin_accounts_admins", force: :cascade do |t|
    t.integer  "admin_account_id"
    t.integer  "admin_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_accounts_admins", ["admin_account_id"], name: "index_admin_accounts_admins_on_admin_account_id", using: :btree
  add_index "admin_accounts_admins", ["admin_id"], name: "index_admin_accounts_admins_on_admin_id", using: :btree

  create_table "admin_accounts_teachers", force: :cascade do |t|
    t.integer  "admin_account_id"
    t.integer  "teacher_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_accounts_teachers", ["admin_account_id"], name: "index_admin_accounts_teachers_on_admin_account_id", using: :btree
  add_index "admin_accounts_teachers", ["teacher_id"], name: "index_admin_accounts_teachers_on_teacher_id", using: :btree

  create_table "authors", force: :cascade do |t|
    t.string   "name",                limit: 255
    t.string   "avatar_file_name",    limit: 255
    t.string   "avatar_content_type", limit: 255
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.text     "description"
  end

  create_table "categories", force: :cascade do |t|
    t.text     "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "checkboxes", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "objective_id"
    t.string   "metadata"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "checkboxes", ["user_id", "objective_id"], name: "index_checkboxes_on_user_id_and_objective_id", unique: true, using: :btree

  create_table "classroom_activities", force: :cascade do |t|
    t.integer  "classroom_id"
    t.integer  "activity_id"
    t.integer  "unit_id"
    t.datetime "due_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assigned_student_ids",                             array: true
    t.boolean  "visible",              default: true, null: false
  end

  add_index "classroom_activities", ["activity_id"], name: "index_classroom_activities_on_activity_id", using: :btree
  add_index "classroom_activities", ["classroom_id"], name: "index_classroom_activities_on_classroom_id", using: :btree
  add_index "classroom_activities", ["unit_id"], name: "index_classroom_activities_on_unit_id", using: :btree

  create_table "classrooms", force: :cascade do |t|
    t.string   "name",                limit: 255
    t.string   "code",                limit: 255
    t.integer  "teacher_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "clever_id",           limit: 255
    t.string   "grade",               limit: 255
    t.boolean  "visible",                         default: true, null: false
    t.integer  "google_classroom_id"
    t.integer  "grade_level"
  end

  add_index "classrooms", ["code"], name: "index_classrooms_on_code", using: :btree
  add_index "classrooms", ["grade"], name: "index_classrooms_on_grade", using: :btree
  add_index "classrooms", ["grade_level"], name: "index_classrooms_on_grade_level", using: :btree

  create_table "comments", force: :cascade do |t|
    t.string   "title",              limit: 255
    t.text     "body"
    t.integer  "user_id"
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.string   "ancestry",           limit: 255
    t.string   "reply_type",         limit: 255
    t.integer  "lecture_chapter_id"
  end

  add_index "comments", ["ancestry"], name: "index_comments_on_ancestry", using: :btree

  create_table "concept_results", force: :cascade do |t|
    t.integer "activity_session_id"
    t.integer "concept_id",                 null: false
    t.json    "metadata"
    t.integer "activity_classification_id"
  end

  add_index "concept_results", ["activity_classification_id"], name: "index_concept_results_on_activity_classification_id", using: :btree
  add_index "concept_results", ["activity_session_id"], name: "index_concept_results_on_activity_session_id", using: :btree

  create_table "concepts", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "parent_id"
    t.string   "uid",        limit: 255, null: false
  end

  create_table "csv_exports", force: :cascade do |t|
    t.string   "export_type", limit: 255
    t.datetime "emailed_at"
    t.json     "filters"
    t.integer  "teacher_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "csv_file",    limit: 255
  end

  create_table "districts", force: :cascade do |t|
    t.string   "clever_id",  limit: 255
    t.string   "name",       limit: 255
    t.string   "token",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "districts_users", id: false, force: :cascade do |t|
    t.integer "district_id"
    t.integer "user_id"
  end

  add_index "districts_users", ["district_id", "user_id"], name: "index_districts_users_on_district_id_and_user_id", using: :btree
  add_index "districts_users", ["district_id"], name: "index_districts_users_on_district_id", using: :btree
  add_index "districts_users", ["user_id"], name: "index_districts_users_on_user_id", using: :btree

  create_table "file_uploads", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.string   "file",        limit: 255
    t.text     "description"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "firebase_apps", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "secret",     limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ip_locations", force: :cascade do |t|
    t.string   "country"
    t.string   "city"
    t.string   "state"
    t.integer  "zip"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ip_locations", ["user_id"], name: "index_ip_locations_on_user_id", using: :btree
  add_index "ip_locations", ["zip"], name: "index_ip_locations_on_zip", using: :btree

  create_table "oauth_access_grants", force: :cascade do |t|
    t.integer  "resource_owner_id",             null: false
    t.integer  "application_id",                null: false
    t.string   "token",             limit: 255, null: false
    t.integer  "expires_in",                    null: false
    t.text     "redirect_uri",                  null: false
    t.datetime "created_at",                    null: false
    t.datetime "revoked_at"
    t.string   "scopes",            limit: 255
  end

  add_index "oauth_access_grants", ["token"], name: "index_oauth_access_grants_on_token", unique: true, using: :btree

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.integer  "resource_owner_id"
    t.integer  "application_id"
    t.string   "token",             limit: 255, null: false
    t.string   "refresh_token",     limit: 255
    t.integer  "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at",                    null: false
    t.string   "scopes",            limit: 255
  end

  add_index "oauth_access_tokens", ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true, using: :btree
  add_index "oauth_access_tokens", ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id", using: :btree
  add_index "oauth_access_tokens", ["token"], name: "index_oauth_access_tokens_on_token", unique: true, using: :btree

  create_table "oauth_applications", force: :cascade do |t|
    t.string   "name",         limit: 255, null: false
    t.string   "uid",          limit: 255, null: false
    t.string   "secret",       limit: 255, null: false
    t.text     "redirect_uri",             null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "oauth_applications", ["uid"], name: "index_oauth_applications_on_uid", unique: true, using: :btree

  create_table "objectives", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.string   "help_info"
    t.string   "section"
    t.string   "action_url"
    t.integer  "section_placement"
    t.boolean  "archived",          default: false
  end

  create_table "page_areas", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.string   "description", limit: 255
    t.text     "content"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "rules_misseds", force: :cascade do |t|
    t.integer  "rule_id"
    t.integer  "user_id"
    t.integer  "assessment_id"
    t.datetime "time_take"
    t.boolean  "missed"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "schools", force: :cascade do |t|
    t.string   "nces_id",               limit: 255
    t.string   "lea_id",                limit: 255
    t.string   "leanm",                 limit: 255
    t.string   "name",                  limit: 255
    t.string   "phone",                 limit: 255
    t.string   "mail_street",           limit: 255
    t.string   "mail_city",             limit: 255
    t.string   "mail_state",            limit: 255
    t.string   "mail_zipcode",          limit: 255
    t.string   "street",                limit: 255
    t.string   "city",                  limit: 255
    t.string   "state",                 limit: 255
    t.string   "zipcode",               limit: 255
    t.string   "nces_type_code",        limit: 255
    t.string   "nces_status_code",      limit: 255
    t.string   "magnet",                limit: 255
    t.string   "charter",               limit: 255
    t.string   "ethnic_group",          limit: 255
    t.decimal  "longitude",                         precision: 9, scale: 6
    t.decimal  "latitude",                          precision: 9, scale: 6
    t.integer  "ulocal"
    t.integer  "fte_classroom_teacher"
    t.integer  "lower_grade"
    t.integer  "upper_grade"
    t.integer  "school_level"
    t.integer  "free_lunches"
    t.integer  "total_students"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "clever_id",             limit: 255
  end

  add_index "schools", ["name"], name: "index_schools_on_name", using: :btree
  add_index "schools", ["nces_id"], name: "index_schools_on_nces_id", using: :btree
  add_index "schools", ["state"], name: "index_schools_on_state", using: :btree
  add_index "schools", ["zipcode"], name: "index_schools_on_zipcode", using: :btree

  create_table "schools_users", id: false, force: :cascade do |t|
    t.integer "school_id"
    t.integer "user_id"
  end

  add_index "schools_users", ["school_id", "user_id"], name: "index_schools_users_on_school_id_and_user_id", using: :btree
  add_index "schools_users", ["school_id"], name: "index_schools_users_on_school_id", using: :btree
  add_index "schools_users", ["user_id"], name: "index_schools_users_on_user_id", using: :btree

  create_table "sections", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "uid",        limit: 255
  end

  create_table "students_classrooms", force: :cascade do |t|
    t.integer  "student_id"
    t.integer  "classroom_id"
    t.boolean  "visible",      default: true, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "students_classrooms", ["classroom_id"], name: "index_students_classrooms_on_classroom_id", using: :btree
  add_index "students_classrooms", ["student_id"], name: "index_students_classrooms_on_student_id", using: :btree

  create_table "subscriptions", force: :cascade do |t|
    t.integer  "user_id"
    t.date     "expiration"
    t.integer  "account_limit"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "account_type"
  end

  create_table "topic_categories", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "uid",        limit: 255
  end

  add_index "topic_categories", ["name"], name: "index_topic_categories_on_name", using: :btree

  create_table "topics", force: :cascade do |t|
    t.string   "name",              limit: 255
    t.integer  "section_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "topic_category_id"
    t.string   "uid",               limit: 255
  end

  add_index "topics", ["topic_category_id"], name: "index_topics_on_topic_category_id", using: :btree

  create_table "unit_template_categories", force: :cascade do |t|
    t.string "name",            limit: 255
    t.string "primary_color",   limit: 255
    t.string "secondary_color", limit: 255
  end

  create_table "unit_templates", force: :cascade do |t|
    t.string  "name",                      limit: 255
    t.integer "unit_template_category_id"
    t.integer "time"
    t.text    "grades"
    t.integer "author_id"
    t.text    "problem"
    t.text    "summary"
    t.text    "teacher_review"
  end

  add_index "unit_templates", ["author_id"], name: "index_unit_templates_on_author_id", using: :btree
  add_index "unit_templates", ["unit_template_category_id"], name: "index_unit_templates_on_unit_template_category_id", using: :btree

  create_table "units", force: :cascade do |t|
    t.string   "name",         limit: 255
    t.integer  "classroom_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "visible",                  default: true, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",                  limit: 255
    t.string   "email",                 limit: 255
    t.string   "password_digest",       limit: 255
    t.string   "role",                  limit: 255, default: "user"
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.string   "classcode",             limit: 255
    t.boolean  "active",                            default: false
    t.string   "username",              limit: 255
    t.string   "token",                 limit: 255
    t.inet     "ip_address"
    t.string   "clever_id",             limit: 255
    t.boolean  "signed_up_with_google",             default: false
    t.boolean  "send_newsletter",                   default: false
  end

  add_index "users", ["active"], name: "index_users_on_active", using: :btree
  add_index "users", ["classcode"], name: "index_users_on_classcode", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", using: :btree
  add_index "users", ["role"], name: "index_users_on_role", using: :btree
  add_index "users", ["token"], name: "index_users_on_token", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", using: :btree

  add_foreign_key "concept_results", "activity_classifications"
end
