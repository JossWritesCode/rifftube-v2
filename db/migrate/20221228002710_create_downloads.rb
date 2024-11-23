class CreateDownloads < ActiveRecord::Migration[7.0]
  def change
    create_table :downloads, id: :uuid do |t|
      t.binary :data
      t.string :status

      t.timestamps
    end
  end
end
