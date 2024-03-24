#!/bin/bash

# Start the loopback server
node loopback_server.js > /dev/null &

# Report the success
echo "Server is running on http://localhost:3000"

# Open an instance of google chrome
google-chrome --enable-unsafe-webgpu --enable-features=Vulkan,UseSkiaRenderer http://localhost:3000 > /dev/null 2>&1 &

wait

# Cleanly exit node server
kill $!

# Report the status of the backend termination
if [ $? == 0 ]; then echo "Backend exited gracefully"; else echo "Backend exploded"; fi
