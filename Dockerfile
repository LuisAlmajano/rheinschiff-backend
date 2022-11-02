# Download version of node
FROM node:alpine

# Set the work directory to backend folder
WORKDIR /backend

# Copy package.json file in the backend folder inside container
COPY package*.json .

# Install the dependencies in the container
RUN npm install

# Copy the rest of the code in the container
COPY . .

# Expose the service over PORT 5001
EXPOSE 5001

# Run the node server with index.js file
CMD ["node", "index.js"]

