FROM node:20.12.2-alpine3.19
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
# and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .
CMD ng serve