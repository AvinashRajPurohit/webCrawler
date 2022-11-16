FROM node:18

# Create app directory
WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]

RUN npm install
COPY . .


EXPOSE 4000
