class CreateRiffFlags < ActiveRecord::Migration[7.0]
  def change
    create_table :riff_flags do |t|
      t.references :user, null: false, foreign_key: true
      t.references :riff, null: false, foreign_key: true
      t.string :type
      t.string :comment

      t.timestamps
    end
  end
end
