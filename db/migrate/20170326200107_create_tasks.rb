class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.string :title
      t.references :board, foreign_key: true
      t.references :list, foreign_key: true
      t.references :assignee
      t.references :creator

      t.timestamps
    end
  end
end
