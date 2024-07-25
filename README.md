# Remote Terminal 

Terminal shell/desktop access for GitHub Actions for debugging purposes

Live site https://xunhuang.github.io/remote_terminal/

## Status

- functional: Linux Terminal in a web browser
- functional: MacOS Terminal in a web browser
- functional: Linux in a X enviroment in a web browser
- work in progress: Mac in a X enviroment in a web browser. Mouse clicks and keyboard input somehow not working. Displays and mouse movements work. 

## Behind the scenes

Lots of the legacy technologies are used in this project. 

- Github Actions
- tmate (deprecated, potential replacement is xterm.js, tunnel mole etc.)
- X server/Xvfb/x11vnc 
- ngrok (not free, try tunnel mole, local tunnel)
- noVNC (not the best)

####
This project took inspiration from [fastmac](https://github.com/jph00/fastmac)
