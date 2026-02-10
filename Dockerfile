FROM node:22

WORKDIR /ExamPortal

COPY package*.json ./

RUN npm install

COPY Backend/ Backend/

COPY Frontend/ Frontend/

EXPOSE 3000

CMD ["node", "Backend/server.js"]