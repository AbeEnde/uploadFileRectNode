FROM node:latest
LABEL description="This is the base docker image for v1.0 of our uploadB App."
WORKDIR /app
COPY package.json ./
RUN npm install typescript
COPY . .
EXPOSE 3001
CMD ["node", "dist/app.js"]
