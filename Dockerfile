
# Instructions from the app developer

# - you should use node 5.1.281.89 but lets try 8.3.0-alpine to see what happens
FROM node:8.3.0

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
# - this app listens on port 8080, but the container should launch on port 80
    # so it should responde to http://localhost:80 on your computer
    # default to port 3000 for node, and 5858 or 9229 for debug
EXPOSE 3090

# - then it should create a directory /usr/src/react-app for all files with 'mkdir -p /usr/src/react-app
RUN mkdir -p /usr/express-app
# Node uses a "package manager", so it needs to copy in package.json file but move into working directory first
WORKDIR /usr/express-app
COPY package.json package.json
COPY package-lock.json package-lock.json

# - then it needs to run npm install to install dependencies from package.json
    # to keep it clean and small run npm cache clean
RUN npm install && npm cache verify

# copy all files from current directory on host into current working directory in image
COPY . .

# - then it needs to start container with command
CMD [ "node", "index.js" ]
