class CreateUserOptions < ActiveRecord::Migration[7.0]
  def change
    create_table :user_options do |t|
      t.references :user, null: false, foreign_key: true
      t.float :auto_duration_word_rate, default: 0.4
      t.float :auto_duration_constant, default: 0.5
      t.integer :avatar_mode, default: 1
      t.boolean :always_speak_text, default: false
      t.string :default_voice, default: nil
      t.boolean :pause_to_riff, default: true
      t.boolean :play_after_riff, default: true
      t.boolean :immediate_save, default: false

      t.timestamps
    end
  end
end
