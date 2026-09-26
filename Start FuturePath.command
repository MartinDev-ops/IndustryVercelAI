#!/bin/bash
# Double-click me to run FuturePath AI as a real website (so YouTube videos play).
cd "$(dirname "$0")"
PORT=5500
( sleep 1; open "http://localhost:$PORT/index.html" ) &
echo "FuturePath AI running at http://localhost:$PORT  —  close this window to stop."
python3 -m http.server $PORT
