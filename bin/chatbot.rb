require 'sinatra'
require 'json'
require 'bundler/setup'
require 'uri'
require 'open-uri'
require 'httparty'
require 'wit'
require "sinatra/config_file"

config_file '../config.yml'

get '/' do
  @greeting = settings.greeting
  p @greeting
  send_file File.expand_path('index.html', settings.public_folder)
end


# actions = {
#   send: -> (request, response) {
#     puts("sending... #{response['text']}")
#   },
#   my_action: -> (request) {
#     return request['context']
#   },
# }

# client = Wit.new(access_token: access_token, actions: actions)


# rsp = client.message('what is the weather in London?')
# puts("Yay, got Wit.ai response: #{rsp}")  


