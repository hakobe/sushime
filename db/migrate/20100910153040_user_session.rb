class UserSession < ActiveRecord::Migration
  def self.up
    add_column :users, :session_id, :string
  end

  def self.down
    remove_column :users, :session_id
  end
end
