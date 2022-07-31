## how to run
- make sure port 3000 & 3005 is not in use
```bash
cd backend
npm install
npm run start:dev
## open new terminal
cd client
npm install
npm start
```

## how to run backend tests
```bash
cd backend
npm run test
cd ..
```

## how to run frontend tests
- first make sure backend & frontend is running (see how to run section above)
```bash
cd client
npm run cypress:open
```

## folder structure
- backend (nodejs express + typescript)
  - spec (contains tests for backend using jasmine)
  - src (contains code for backend)
    - routes 
    - repos (local file database)
    - services (logic for routes)
    - shared **(contains Checkout class)**
- client (react + typescript)
  - cypress (e2e testing)
  - src (contains code for frontend)
    - components (contains components for frontend)
    - context (context api for cart and current user)
    - API.js (contains api calls to backend with axios)
    - types (contains typescript types)


if you have any questions email me at [ganganimaulik@gmail.com](mailto:ganganimaulik@gmail.com)