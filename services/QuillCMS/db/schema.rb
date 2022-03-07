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

ActiveRecord::Schema.define(version: 2022_02_18_185111) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "responses", force: :cascade do |t|
    t.string "uid"
    t.integer "parent_id"
    t.string "parent_uid"
    t.string "question_uid"
    t.string "author"
    t.text "text"
    t.text "feedback"
    t.integer "count", default: 1
    t.integer "first_attempt_count", default: 0
    t.integer "child_count", default: 0
    t.boolean "optimal"
    t.boolean "weak"
    t.jsonb "concept_results"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "spelling_error", default: false
    t.index ["question_uid", "text"], name: "index_responses_on_question_uid_and_text", unique: true
    t.index ["uid"], name: "index_responses_on_uid"
  end


  create_view "graded_responses", materialized: true, sql_definition: <<-SQL
      SELECT responses.id,
      responses.uid,
      responses.parent_id,
      responses.parent_uid,
      responses.question_uid,
      responses.author,
      responses.text,
      responses.feedback,
      responses.count,
      responses.first_attempt_count,
      responses.child_count,
      responses.optimal,
      responses.weak,
      responses.concept_results,
      responses.created_at,
      responses.updated_at,
      responses.spelling_error
     FROM responses
    WHERE (responses.optimal IS NOT NULL);
  SQL
  add_index "graded_responses", ["id"], name: "index_graded_responses_on_id", unique: true
  add_index "graded_responses", ["optimal"], name: "index_graded_responses_on_optimal"
  add_index "graded_responses", ["question_uid"], name: "index_graded_responses_on_question_uid"

  create_view "multiple_choice_responses", materialized: true, sql_definition: <<-SQL
      SELECT responses_filtered.id,
      responses_filtered.uid,
      responses_filtered.parent_id,
      responses_filtered.parent_uid,
      responses_filtered.question_uid,
      responses_filtered.author,
      responses_filtered.text,
      responses_filtered.feedback,
      responses_filtered.count,
      responses_filtered.first_attempt_count,
      responses_filtered.child_count,
      responses_filtered.optimal,
      responses_filtered.weak,
      responses_filtered.concept_results,
      responses_filtered.created_at,
      responses_filtered.updated_at,
      responses_filtered.spelling_error
     FROM ( SELECT responses.id,
              responses.uid,
              responses.parent_id,
              responses.parent_uid,
              responses.question_uid,
              responses.author,
              responses.text,
              responses.feedback,
              responses.count,
              responses.first_attempt_count,
              responses.child_count,
              responses.optimal,
              responses.weak,
              responses.concept_results,
              responses.created_at,
              responses.updated_at,
              responses.spelling_error,
              rank() OVER (PARTITION BY responses.question_uid ORDER BY responses.count DESC) AS rank
             FROM responses
            WHERE ((responses.count > 10) AND ((responses.optimal IS NULL) OR (responses.optimal = false)))) responses_filtered
    WHERE (responses_filtered.rank <= 2);
  SQL
  add_index "multiple_choice_responses", ["id"], name: "index_multiple_choice_responses_on_id", unique: true
  add_index "multiple_choice_responses", ["optimal"], name: "index_multiple_choice_responses_on_optimal"
  add_index "multiple_choice_responses", ["question_uid"], name: "index_multiple_choice_responses_on_question_uid"

end
