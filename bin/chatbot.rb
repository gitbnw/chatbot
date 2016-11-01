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
  
  def message query
    @v = '20161001'
    @q = query
    self.class.get("/message?v=#{@v}&q=#{@q}", :headers => { "Authorization" => @auth})
  end

end


client = WitWeb.new(access_token)


get '/message' do

  @q = params[:q]

  rsp = client.message(@q)
  
  return rsp.to_json

end

post '/converse/msg' do

  @session_id = params[:session_id]
  @q = params[:q]

  rsp = client.converse(@session_id, @q)
  return rsp.to_json

end

post '/converse/action' do

  @session_id = params[:session_id]
  @q = nil
  @context = send(params[:action])

  rsp = client.converse(@session_id, @q, @context.to_json)
  return rsp.to_json

end


class Job
  attr_accessor :company, :position, :span, :summary
  def initialize(company, position, span, summary)  
    @company = company  
    @position = position
    @span = span
    @summary = summary
  end

end

sys_adm = Job.new('Stellar Manufacturing', 'Systems Administrator', '2011 - 2014', 'Administered and supported Windows environment.  Back-end and SQL work.')  
data_analys = Job.new('JDA eHealth Systems', 'Data Analyst', '2014 - 2015', 'Monitoring and troubleshooting multiple ETL processes of healthcare billing data. Application programmed in Foxpro and SQL.')  
sys_analys = Job.new('the Village of Oak Park', 'Systems Analyst', '2015 - 2016', 'Developed web application with javascript front-end (ExtJS) and Coldfusion/SQL backend.  Supported various applications with SQL programming.')  

@work_history = [sys_adm, data_analys, sys_analys]

def getJobs
  jobStr = "Byron's last 3 jobs were as "
    @work_history.each do |job|
      if @work_history.last == job
        jobStr += "and "
      end
      jobStr += "a #{job.position} at #{job.company}"
      if @work_history.last != job
        jobStr += ", "
      else
      	jobStr += "."
      end      
    end
  context = Hash.new
  context["jobStr"] = jobStr
  return context
end



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

def cleanUp
  context = Hash.new
  return context
end

def nextStep
  context = Hash.new
  return context 
end


