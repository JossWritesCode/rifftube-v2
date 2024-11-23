class AddSpeakToRiff < ActiveRecord::Migration[7.0]
  def change
    add_column :riffs, :speak, :boolean, default: false
  end
end
