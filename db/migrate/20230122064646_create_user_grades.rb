class CreateUserGrades < ActiveRecord::Migration[7.0]
  def change
    create_table :user_grades do |t|
      t.references :grader, foreign_key: { to_table: :users }, index: true
      t.references :gradee, foreign_key: { to_table: :users }, index: true
      t.integer :grade, default: 0

      t.timestamps
    end
  end
end
