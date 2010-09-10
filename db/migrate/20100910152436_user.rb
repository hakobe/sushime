class User < ActiveRecord::Migration
  def self.up
    add_column :users, :screen_name, :string
    add_column :users, :token, :string
    add_column :users, :token_secret, :string
  end

  def self.down
    remove_column :users, :screen_name
    remove_column :users, :token
    remove_column :users, :token_secret
  end
end
