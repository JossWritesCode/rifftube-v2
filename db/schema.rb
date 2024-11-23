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

ActiveRecord::Schema[7.0].define(version: 2024_01_24_065104) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "downloads", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.binary "data"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "knex_migrations", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.integer "batch"
    t.timestamptz "migration_time"
  end

  create_table "knex_migrations_lock", primary_key: "index", id: :serial, force: :cascade do |t|
    t.integer "is_locked"
  end

  create_table "riff_flags", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "riff_id", null: false
    t.string "type"
    t.string "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["riff_id"], name: "index_riff_flags_on_riff_id"
    t.index ["user_id"], name: "index_riff_flags_on_user_id"
  end

  create_table "riff_sets", force: :cascade do |t|
    t.string "name"
    t.bigint "video_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["video_id"], name: "index_riff_sets_on_video_id"
  end

  create_table "riff_sets_riffs", id: false, force: :cascade do |t|
    t.bigint "riff_set_id"
    t.bigint "riff_id"
    t.index ["riff_id"], name: "index_riff_sets_riffs_on_riff_id"
    t.index ["riff_set_id"], name: "index_riff_sets_riffs_on_riff_set_id"
  end

  create_table "riffs", id: :serial, force: :cascade do |t|
    t.binary "audio"
    t.float "duration"
    t.float "start"
    t.text "text"
    t.integer "rating"
    t.boolean "isText", default: false, null: false
    t.integer "user_id", null: false
    t.integer "video_id", null: false
    t.boolean "speak", default: false
    t.boolean "showText", default: true
    t.boolean "autoDuration", default: false
    t.string "voice"
  end

  create_table "user_confirmations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_confirmations_on_user_id"
  end

  create_table "user_grades", force: :cascade do |t|
    t.bigint "grader_id"
    t.bigint "gradee_id"
    t.integer "grade", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["gradee_id"], name: "index_user_grades_on_gradee_id"
    t.index ["grader_id"], name: "index_user_grades_on_grader_id"
  end

  create_table "user_options", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.float "auto_duration_word_rate", default: 0.4
    t.float "auto_duration_constant", default: 0.5
    t.integer "avatar_mode", default: 1
    t.boolean "always_speak_text", default: false
    t.string "default_voice"
    t.boolean "pause_to_riff", default: true
    t.boolean "play_after_riff", default: true
    t.boolean "immediate_save", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "threshold_mode", default: 0
    t.string "threshold_options"
    t.index ["user_id"], name: "index_user_options_on_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255
    t.string "email", limit: 255
    t.binary "riff_pic"
    t.string "password_digest"
    t.boolean "confirmed", default: false
    t.index ["email"], name: "users_email_unique", unique: true
  end

  create_table "videos", id: :serial, force: :cascade do |t|
    t.string "url", limit: 255, null: false
    t.string "title", limit: 255
    t.float "duration"
    t.string "host", limit: 255, default: "youtube.com"
    t.index ["url"], name: "videos_url_unique", unique: true
  end

  create_table "videos_users", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "video_id"
  end

  add_foreign_key "riff_flags", "riffs"
  add_foreign_key "riff_flags", "users"
  add_foreign_key "riff_sets", "videos"
  add_foreign_key "riffs", "users", name: "riffs_user_id_foreign", on_update: :cascade, on_delete: :cascade
  add_foreign_key "riffs", "videos", name: "riffs_video_id_foreign", on_update: :cascade, on_delete: :cascade
  add_foreign_key "user_confirmations", "users"
  add_foreign_key "user_grades", "users", column: "gradee_id"
  add_foreign_key "user_grades", "users", column: "grader_id"
  add_foreign_key "user_options", "users"
  add_foreign_key "videos_users", "users", name: "videos_users_user_id_foreign", on_update: :cascade, on_delete: :cascade
  add_foreign_key "videos_users", "videos", name: "videos_users_video_id_foreign", on_update: :cascade, on_delete: :nullify
end
