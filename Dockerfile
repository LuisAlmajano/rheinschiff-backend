# docker build -t luigialm/rheinschiff-backend .
# docker run -p 5001:5001 luigialm/rheinschiff-backend

# Download version of node
FROM node:16-alpine

# The NODE_ENV environment variable specifies the environment in which an application is running (usually, development or production). 
# One of the simplest things you can do to improve performance is to set NODE_ENV to production.
# ENV NODE_ENV=production

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

