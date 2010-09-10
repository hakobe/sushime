require 'digest/sha1'
require 'twitter'
require 'pp'

class Twitter::Base
    def update_profile_image(file)
      perform_post("/1/account/update_profile_image.json", build_multipart_bodies(:image => file))
    end
end

class User < ActiveRecord::Base
  def new_session
    key = Digest::SHA1.hexdigest(
      self.screen_name + Time.now.to_i.to_s
    )
    p key
    self.session_id = key
  end

  def twitter
    if @twitter.nil? 
      oauth = Twitter::OAuth.new( # XXX
        'om1i4JMQdgdwnbmokDBkNg', 
        '5T71pRJGQAyvStMHqlFil14HXk6rHW1RnBqY0EGtc'
      )
      oauth.authorize_from_access(
        self.token, self.token_secret
      )
      @twitter = Twitter::Base.new(oauth)
    end

    @twitter
  end

  def twitter_user
    self.twitter.user(self.screen_name)
  end

  def twitter_update_profile_image(file)
    self.twitter.update_profile_image(file)
  end
end

