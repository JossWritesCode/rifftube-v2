class AudioColumnRename < ActiveRecord::Migration[7.0]
  def change
    rename_column :riffs, :audio_datum, :audio
    rename_column :riffs, :start_time, :start
  end
end
