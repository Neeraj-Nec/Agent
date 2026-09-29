FROM node:22-alpine
WORKDIR /workspace
COPY package.json ./
COPY frontend/package.json ./frontend/package.json
RUN npm install
COPY frontend ./frontend
WORKDIR /workspace/frontend
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
