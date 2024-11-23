class CreateUserConfirmations < ActiveRecord::Migration[7.0]
  def change
    create_table :user_confirmations, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
