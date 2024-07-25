
brew install ngrok xquartz llvm@14
git clone https://github.com/novnc/noVNC/

export PATH="/opt/homebrew/opt/llvm@14/bin:$PATH"
#export LDFLAGS="-L/opt/homebrew/opt/llvm@14/lib"
#export CPPFLAGS="-I/opt/homebrew/opt/llvm@14/include"
brew install --build-from-source ./x11vnc.rb    

# curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
#   sudo gpg --dearmor -o /etc/apt/keyrings/ngrok.gpg && \
#   echo "deb [signed-by=/etc/apt/keyrings/ngrok.gpg] https://ngrok-agent.s3.amazonaws.com buster main" | \
#   sudo tee /etc/apt/sources.list.d/ngrok.list && \
#   sudo apt update && sudo apt install ngrok
ngrok config add-authtoken $NGROK_TOKEN

# sudo apt-get update
# sudo apt-get install -y x11vnc xvfb fluxbox  websockify novnc xterm

export PATH="/System/Volumes/Data/opt/X11/bin:$PATH"

export DISPLAY=:1
Xvfb $DISPLAY -screen 0 1600x1200x16 &

sleep 3
# sudo npm install -g localtunnel
xterm &
twm &
x11vnc -display $DISPLAY -bg -forever -nopw  -xkb & 

# git clone https://github.com/novnc/noVNC/
cd noVNC
 ./utils/novnc_proxy --vnc localhost:5900 & 

ngrok http http://localhost:6080   &


# fluxbox &
# sleep 1
# websockify --web /usr/share/novnc 8080 localhost:5900 &
# sleep 5
# lt --port 8080  &
# lt --port 8080 | awk '{print $4."/vnc.html"}'      &
# echo "Done with this... hopefully we see a port"
# ngrok http http://localhost:8080   &
sleep 5
baseurl=`curl -s http://localhost:4040/api/tunnels| jq -r '.tunnels[0].public_url'`
novnc_url="$baseurl/vnc.html"
echo $novnc_url

echo "callback_url is $callback_url"
echo "response_id is $response_id"

if [ -n "$response_id" ] && [ -n "$callback_url" ]; then
  url_encoded=`echo "$url" | jq -sRr @uri | sed 's/%0A$//'`
  curl_url="$callback_url/set?key=$response_id&value=$url_encoded"
  echo $curl_url
  curl -X GET $curl_url
fi