FROM node:20-alpine
USER root
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#RUN chown -R /app
EXPOSE 5000
CMD ["node", "server.js"]