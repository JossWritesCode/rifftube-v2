class CreateRiffSets < ActiveRecord::Migration[7.0]
  def change
    create_table :riff_sets do |t|
      t.string :name
      t.references :video, null: false, foreign_key: true

      t.timestamps
    end

    create_table :riff_sets_riffs, id: false do |t|
      t.belongs_to :riff_set
      t.belongs_to :riff
    end
  end
end
