FROM node:24-alpine

WORKDIR /app
RUN corepack enable

# Install dependencies first so they cache independently of source changes
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/excavator-prettier-config/package.json packages/excavator-prettier-config/
COPY packages/excavator-projects/package.json packages/excavator-projects/
COPY packages/excavator-script/package.json packages/excavator-script/
COPY packages/excavator-web/package.json packages/excavator-web/
RUN yarn install --immutable

COPY . .
RUN yarn workspace excavator-web build

ENV NODE_ENV=production
WORKDIR /app/packages/excavator-web
EXPOSE 3000
CMD ["sh", "-c", "yarn migrate && yarn start"]
