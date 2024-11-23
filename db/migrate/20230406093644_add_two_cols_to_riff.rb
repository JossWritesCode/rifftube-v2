class AddTwoColsToRiff < ActiveRecord::Migration[7.0]
  def change
    add_column :riffs, :showText, :boolean, default: true
    add_column :riffs, :autoDuration, :boolean, default: false
  end
end
