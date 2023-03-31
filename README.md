# Submission for full-stack-code-challenge-req97073

## Information about submission

The application will be accessible at http://localhost:3001

The api is hosted from http://localhost:3000/api

API Component
- Data is populated in the Node.js server via db.json (35 entries). Changes to the data made via api request are made in-memory (Data is persisted until server/db.json are updated/refreshed)
  - db.json was generated via https://json-generator.com/ using
  ```
  [
    '{{repeat(35, 35)}}',
    {
      productId: '{{index()}}',
      productName: '{{lorem(1, "words")}}',
      productOwnerName: '{{firstName()}} {{surname()}}',
      Developers: [
        '{{repeat(1,5)}}',
        '{{firstName()}} {{surname()}}'
      ],
      scrumMasterName: '{{firstName()}} {{surname()}}',
      startDate: '{{date(new Date(2014, 0, 1), new Date(), "YYYY/MM/dd")}}',
      methodology: '{{random("Agile", "Scrum", "Kanban", "Waterfall")}}'
    }
  ]
  ```
- A decision was made to reserve deleted `productId`'s for new entries. ie If `productId=0` is deleted, the next posted Product will have `productId=0`. This implementation was chosen to maintain easy sorting and quick look-ups via a hashmap data structure for storing data in the backend. 
- The API is documented via Swagger at http://localhost:3000/api/api-docs 

Frontend component
- Story 1 is completed via text & table display on the home page
- Story 2 is completed via `Add new product` button and subsequent modal pop-up
- Story 3 is completed via the pencil icon inline with each row within table display
- Story 4 & 5 are completed together via the `Scrum Master and Developer Search` input box & reactive text display at the top of the page
- Each api call is followed by a call to fetch all products from the server. This decision was made in favour of consistency with the server as much as possible but can be changed for performance considerations

## Setup instructions
1. Docker (Run commands from main directory)
   
```
  docker-compose build
  docker-compose up
```

2. Local setup with two terminals

On terminal 1 (Run commands from main directory):
```
  cd server
  yarn install # or npm install
  yarn dev # or npm run dev
```

On terminal 2 (Run commands from main directory):
```
  cd client
  rm package.json # There are different proxies depending on local vs docker setup and the base package.json is setup for a Docker proxy
  mv package-local.json package.json
  yarn install # or npm install
  yarn start # or npm run start
```
