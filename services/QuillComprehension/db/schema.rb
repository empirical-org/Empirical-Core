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

ActiveRecord::Schema.define(version: 2018_06_10_182341) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "activities", force: :cascade do |t|
    t.string "title"
    t.text "article"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "question_sets", force: :cascade do |t|
    t.bigint "activity_id"
    t.text "prompt"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_id"], name: "index_question_sets_on_activity_id"
  end

  create_table "questions", force: :cascade do |t|
    t.text "prompt"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "question_set_id"
    t.index ["question_set_id"], name: "index_questions_on_question_set_id"
  end

  create_table "responses", force: :cascade do |t|
    t.bigint "question_id"
    t.text "text"
    t.integer "submissions", default: 1
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_responses_on_question_id"
    t.index ["text", "question_id"], name: "index_responses_on_text_and_question_id", unique: true
  end

  add_foreign_key "question_sets", "activities"
  add_foreign_key "questions", "question_sets"
  add_foreign_key "responses", "questions"
end
