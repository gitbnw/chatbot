
Chatbot to present author info on portfolio site

Sinatra + Wit AI + Angular 1

boot on cloud9: bundle exec ruby bin/chatbot.rb -p $PORT -o $IP
run irb console: bundle exec irb -I. -r bin/chatbot.rb

##things to work on:
- refactor forever
- wit response actions - server could handle entirely
- better flexibility - limited in handling replies from bot - can only handle 1 text reply or 1 server action then 1 text reply - 