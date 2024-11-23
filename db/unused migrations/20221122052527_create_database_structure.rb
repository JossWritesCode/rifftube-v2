class CreateDatabaseStructure < ActiveRecord::Migration[7.0]
  def change
      # These are extensions that must be enabled in order to support this database
      enable_extension "plpgsql"

      create_table "collaborations", id: :serial, force: :cascade do |t|
        t.integer "playlist_id", null: false
      end

      create_table "collaborators", id: :serial, force: :cascade do |t|
        t.integer "playlist_id", null: false
        t.integer "user_id", null: false
      end

      create_table "knex_migrations", id: :serial, force: :cascade do |t|
        t.string "name", limit: 255
        t.integer "batch"
        t.timestamptz "migration_time"
      end

      create_table "knex_migrations_lock", primary_key: "index", id: :serial, force: :cascade do |t|
        t.integer "is_locked"
      end

      create_table "playlists", id: :serial, force: :cascade do |t|
        t.integer "owner_id", null: false
        t.text "text"
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
      end

      create_table "users", id: :serial, force: :cascade do |t|
        t.string "name", limit: 255
        t.string "email", limit: 255
        t.index ["email"], name: "users_email_unique", unique: true
      end

      create_table "videos", id: :serial, force: :cascade do |t|
        t.string "url", limit: 255, null: false
        t.string "title", limit: 255
        t.float "duration"
        t.index ["url"], name: "videos_url_unique", unique: true
      end

      create_table "videos_users", id: :serial, force: :cascade do |t|
        t.integer "user_id", null: false
        t.integer "video_id"
      end

      add_foreign_key "collaborations", "playlists", name: "collaborations_playlist_id_foreign", on_update: :cascade, on_delete: :cascade
      add_foreign_key "collaborators", "playlists", name: "collaborators_playlist_id_foreign", on_update: :cascade, on_delete: :cascade
      add_foreign_key "collaborators", "users", name: "collaborators_user_id_foreign", on_update: :cascade, on_delete: :cascade
      add_foreign_key "playlists", "users", column: "owner_id", name: "playlists_owner_id_foreign", on_update: :cascade, on_delete: :cascade
      add_foreign_key "riffs", "users", name: "riffs_user_id_foreign", on_update: :cascade, on_delete: :cascade
      add_foreign_key "riffs", "videos", name: "riffs_video_id_foreign", on_update: :cascade, on_delete: :cascade
      add_foreign_key "videos_users", "users", name: "videos_users_user_id_foreign", on_update: :cascade, on_delete: :cascade
      add_foreign_key "videos_users", "videos", name: "videos_users_video_id_foreign", on_update: :cascade, on_delete: :nullify
  end
end
