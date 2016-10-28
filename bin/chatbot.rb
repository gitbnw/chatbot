require 'sinatra'
require 'json'
require 'bundler/setup'
require 'uri'
require 'open-uri'
require 'httparty'
require 'time_diff'


# require 'wit'
require "sinatra/config_file"


config_file '../config.yml'
access_token = settings.wit["client_token"]

get '/' do
#   @greeting = settings.greeting
#   p @greeting
send_file File.expand_path('pages/index.html', settings.public_folder)
end

# actions = {
#   send: -> (request, response) {
#     puts("sending... #{response['text']}")
#     return response
#   },
#   merge: -> (request) {
#     puts 'merge is running'
#     context = request['context']
#     entities = request['entities']

#     # context.delete 'joke'
#     # context.delete 'ack'
    
#     # category = first_entity_value(entities, 'category')
#     choice = first_entity_value(entities, 'choice')
#     context['choice'] = choice unless choice.nil?
#     # sentiment = first_entity_value(entities, 'sentiment')
#     # context['ack'] = sentiment == 'positive' ? 'Glad you liked it.' : 'Hmm.' unless sentiment.nil?
#     return context
#   },  
#   :'getProgSkills' => -> (request) {
#     context = request['context']
    
#     context['progString'] = 'some skills' #getProgSkillsString
#     return context
#   }
# }

class WitWeb
  
  include HTTParty

  debug_output $stdout # <= debug httparty

  base_uri 'https://api.wit.ai'
  format :json

  def initialize access_token
    @access_token = access_token
    @auth = "Bearer " + @access_token
  end
  
  def converse session_id, query, context = {}
    @v = '20161001'
    @s = session_id
    @q = query
    @context = context
    if query.nil?
      self.class.post("/converse?v=#{@v}&session_id=#{@s}", :headers => { "Authorization" => @auth, "Content-Type" => "application/json"}, :body => @context)
    else
      self.class.post("/converse?v=#{@v}&session_id=#{@s}&q=#{@q}", :headers => { "Authorization" => @auth, "Content-Type" => "application/json"}, :body => @context)
    end
  end

end

# client = Wit.new(access_token: access_token, actions: actions)
# client.logger.level = Logger::DEBUG

client = WitWeb.new(access_token)


# get '/chat.json' do
#   content_type :json
#   { 
#     :cnv => {
#       :rsp => rsp,
#       :session => user_session,
#       :sentAt => time,
#       :role => role
#     }
#   }.to_json
# end

post '/converse/msg' do

  @session_id = params[:session_id]
  @q = params[:q]

  rsp = client.converse(@session_id, @q)
  
  return rsp.to_json

end

post '/converse/action' do
puts "my params: #{params}"
  @session_id = params[:session_id]
  @q = nil
  @context = send(params[:action])

  rsp = client.converse(@session_id, @q, @context.to_json)
  return rsp.to_json

end


# class Job
#   attr_accessor :company, :position, :span, :summary
#   def initialize(company, position, span, summary)  
#     @company = company  
#     @position = position
#     @span = span
#     @summary = summary
#   end

# end

# it_supp = Job.new('Investors Title Company', 'IT Support person', '2008 - 2011', 'IT support for real estate title agency.  Recreated the company web site with php and html.  Created a report generator of company activity using php and SQL.')  
# sys_adm = Job.new('Stellar Manufacturing', 'Systems Administrator', '2011 - 2014', 'Administered and supported Windows environment.  Back-end and SQL work.')  
# data_analys = Job.new('JDA eHealth Systems', 'Data Analyst', '2014 - 2015', 'Monitoring and troubleshooting multiple ETL processes of healthcare billing data. Application programmed in Foxpro and SQL.')  
# sys_analys = Job.new('the Village of Oak Park', 'Systems Analyst', '2015 - 2016', 'Developed web application with javascript front-end (ExtJS) and Coldfusion/SQL backend.  Supported various applications with SQL programming.')  

# @work_history = [it_supp, sys_adm, data_analys, sys_analys]

# def getJobSummaryString
#   jobSummaryStr = "Byron's last 4 jobs were as "
#     @work_history.each do |job|
#       if @work_history.last == job
#         jobSummaryStr += "and "
#       end
#       jobSummaryStr += "a #{job.position} at #{job.company}"
#       if @work_history.last != job
#         jobSummaryStr += ", "
#       else
#       	jobSummaryStr += "."
#       end      
#     end

#       return jobSummaryStr
# end



def getDances

  pumpkinDances = [
    {
    "text" => "Bust a move with ",
    "band" => "21 Pilots",
    "link" => "https://www.youtube.com/watch?v=aaHw8QfemHk"
    },{
      "text" => "Oh snap! Get down with ",
      "band" => "Ke$ha",
      "link" => "https://www.youtube.com/watch?v=J_6aIPbQht4"
    },{
      "text" => "Aw yeah.  Love to boogie to ",
      "band" => "Wii Music",
      "link" => "https://www.youtube.com/watch?v=7MGsaN5eDfc"
    }]  
  
  randomDance = pumpkinDances[rand(0..2)]
  text = randomDance["text"]
  band = randomDance["band"]
  link = randomDance["link"]
  danceStr = "#{text}<a target=\"_blank\" href=\"#{link}\">#{band}</a>"
  context = Hash.new
  context["danceStr"] = danceStr
  return context
end

def getProgSkills
  explainStr = "Byron has been working with "
  javascriptStr = "javascript for #{MyTime.new('2015-04-30').calculate[:diff]}."
  rubyStr = "He has been using ruby for #{MyTime.new('2015-09-21').calculate[:diff]}.  Ask again and the times will update ;)"
  progStr = "#{explainStr} #{javascriptStr} #{rubyStr}"
  context = Hash.new
  context["progStr"] = progStr
  return context
end

class MyTime

  attr_accessor :starttime
  def initialize starttime
    @starttime = starttime
  end

  def calculate
      diff = Time.diff(Time.now, Time.parse(starttime), '%y, %M, %w, %d, %H, %N, and %S')
      return diff
  end

end


