FROM node:latest

WORKDIR /usr/src/app/

EXPOSE 3000

COPY . /usr/src/app/


RUN npm install
RUN npm install nodemon -g
RUN npm add express
RUN npm add body-parser
RUN npm add fs
RUN npm install mysql 
RUN npm install loadtest
RUN npm install execsql --save
RUN npm install axios
RUN npm install cors




CMD [ "/bin/bash"]
