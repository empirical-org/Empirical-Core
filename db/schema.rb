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

ActiveRecord::Schema.define(version: 20140114233646) do

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
    t.integer  "items_missed"
    t.integer  "lessons_completed"
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.text     "practice_step_input"
    t.text     "review_step_input"
    t.text     "missed_rules"
    t.text     "score_values"
    t.string   "state",                default: "unstarted", null: false
    t.text     "story_step_input"
    t.float    "grade"
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
