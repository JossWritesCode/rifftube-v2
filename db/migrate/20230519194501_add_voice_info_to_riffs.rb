class AddVoiceInfoToRiffs < ActiveRecord::Migration[7.0]
  def change
    add_column :riffs, :voice, :string
  end
end
