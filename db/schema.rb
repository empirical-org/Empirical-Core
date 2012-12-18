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

ActiveRecord::Schema.define(:version => 20121218155200) do

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

  create_table "courses", :force => true do |t|
    t.string   "title"
    t.string   "professor_name"
    t.text     "description"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "lecture_chapter_images", :force => true do |t|
    t.integer  "lecture_chapter_id"
    t.string   "image_file"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  add_index "lecture_chapter_images", ["lecture_chapter_id"], :name => "index_lecture_chapter_images_on_lecture_chapter_id"

  create_table "lecture_chapters", :force => true do |t|
    t.integer  "lecture_id"
    t.string   "title"
    t.string   "subtitle"
    t.integer  "position"
    t.text     "youtube_embed_code"
    t.text     "citation_text"
    t.text     "reading_text"
    t.text     "annotatable_text"
    t.text     "chart_embed_code"
    t.text     "globe_embed_code"
    t.text     "quiz_embed_code"
    t.text     "slideshow_embed_code"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
  end

  add_index "lecture_chapters", ["lecture_id"], :name => "index_lecture_chapters_on_lecture_id"

  create_table "lectures", :force => true do |t|
    t.string   "title"
    t.string   "lecturer_name"
    t.text     "description"
    t.integer  "course_id"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "lectures", ["course_id"], :name => "index_lectures_on_course_id"

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "role",            :default => "user"
    t.datetime "created_at",                          :null => false
    t.datetime "updated_at",                          :null => false
  end

end
