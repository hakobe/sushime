require 'digest/sha1'

class User < ActiveRecord::Base
  def new_session
    key = Digest::SHA1.hexdigest(
      self.screen_name + Time.now.to_i.to_s
    )
    p key
    self.session_id = key
  end
end
