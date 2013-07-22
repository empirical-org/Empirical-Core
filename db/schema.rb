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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130716160138) do

  create_table "assessments", :force => true do |t|
    t.text     "body"
    t.integer  "chapter_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "assignments", :force => true do |t|
    t.integer  "user_id"
    t.integer  "classcode"
    t.integer  "chapter_id"
    t.datetime "due_date"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "categories", :force => true do |t|
    t.text     "title"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "chapters", :force => true do |t|
    t.string   "title"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.integer  "workbook_id"
    t.text     "description"
    t.text     "rule_position"
  end

  create_table "comments", :force => true do |t|
    t.string   "title"
    t.text     "body"
    t.integer  "user_id"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
    t.string   "ancestry"
    t.string   "reply_type"
    t.integer  "lecture_chapter_id"
  end

  add_index "comments", ["ancestry"], :name => "index_comments_on_ancestry"

  create_table "file_uploads", :force => true do |t|
    t.string   "name"
    t.string   "file"
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "grammar_rules", :force => true do |t|
    t.string   "identifier"
    t.text     "description"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.text     "practice_lesson"
    t.integer  "author_id"
  end

  create_table "grammar_tests", :force => true do |t|
    t.text     "text"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "lessons", :force => true do |t|
    t.text     "body"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.integer  "rule_id"
    t.text     "prompt"
  end

  create_table "page_areas", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.text     "content"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "rules", :force => true do |t|
    t.text     "title"
    t.datetime "created_at",                 :null => false
    t.datetime "updated_at",                 :null => false
    t.integer  "category_id"
    t.integer  "workbook_id", :default => 1
    t.text     "description"
  end

  create_table "rules_misseds", :force => true do |t|
    t.integer  "rule_id"
    t.integer  "user_id"
    t.integer  "assessment_id"
    t.datetime "time_take"
    t.boolean  "missed"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "scores", :force => true do |t|
    t.integer  "user_id"
    t.integer  "assignment_id"
    t.datetime "completion_date"
    t.integer  "items_missed"
    t.integer  "lessons_completed"
    t.datetime "created_at",        :null => false
    t.datetime "updated_at",        :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "role",                   :default => "user"
    t.datetime "created_at",                                 :null => false
    t.datetime "updated_at",                                 :null => false
    t.integer  "classcode"
    t.string   "email_activation_token"
    t.boolean  "active",                 :default => false
    t.datetime "confirmable_set_at"
  end

  create_table "workbooks", :force => true do |t|
    t.string   "title"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
