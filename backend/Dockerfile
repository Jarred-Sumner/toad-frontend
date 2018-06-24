FROM launcher.gcr.io/google/nodejs

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./package.json
COPY yarn.lock ./yarn.lock

RUN yarn

# Copy app source
COPY . .

# Bundle app source
RUN yarn build

# Run yarn with production to eliminate dev dependencies
# since we just build the app.
RUN yarn install --production

CMD [ "yarn", "start" ]