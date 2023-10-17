FROM node:14.17.0

# Create app directory
WORKDIR /dia_api_gw

# Install app dependencies
COPY package.json /dia_api_gw/
RUN npm install

# Bundle app source
COPY . /dia_api_gw/
RUN npm run prepublish

CMD [ "npm", "run", "start" ]
