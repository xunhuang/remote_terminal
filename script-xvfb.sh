
sudo apt-get update
sudo apt-get install -y x11vnc xvfb fluxbox  websockify novnc xterm

export DISPLAY=:1
Xvfb $DISPLAY -screen 0 1024x768x16 &

sudo npm install -g localtunnel
fluxbox &
sleep 1
xterm &
x11vnc -display $DISPLAY -bg -forever -nopw  -xkb & 
sleep 3
websockify --web /usr/share/novnc 8080 localhost:5900 &
sleep 1
lt --port 8080 | awk '{print $4."/vnc.html"}'     &
sleep 3
echo "done"