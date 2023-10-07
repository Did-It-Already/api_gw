FROM node:carbon-slim

# Create app directory
WORKDIR /api_gw

# Install app dependencies
COPY package.json /api_gw/
RUN npm install

# Bundle app source
COPY . /api_gw/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]
