json.extract! user_option, :id, :user_id, :auto_duration_word_rate, :auto_duration_constant, :avatar_mode, :always_speak_text, :default_voice, :pause_to_riff, :play_after_riff, :immediate_save, :created_at, :updated_at
json.url user_option_url(user_option, format: :json)
