#ems-api

RESTful api for event management system


# Running the Application
## 1. Clone the repo
Clone the repo locally. In a terminal, run:
```bash
git clone https://github.com/aws-ems/ems-api.git
```

## 2. Add Environment Variables
Create nodemon.json in the root directory
```json
{
    "env": {
        "DATABASE_URI": "OUR_DB_URI",
        "AUTH_TOKEN": "OUR_AUTH_TOKEN"
    }
}
```

## 3. Install Dependencies and Start
```bash
cd ems-api/
npm install
npm start
```

## 4. Create Test Case and Run Test Suite
```bash
npm test
```

## 5. Test Endpoint using [Postman](https://www.getpostman.com/)
Sample
http://localhost:8000/api/user/{operations}

