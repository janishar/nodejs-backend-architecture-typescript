# Node.js Backend Architecture Typescript Project
Learn to build a Blogging platform like Medium, MindOrks, and FreeCodeCamp - Open-Source Project By AfterAcademy

[![AfterAcademy](https://img.shields.io/badge/AfterAcademy-opensource-blue.svg)](https://afteracademy.com)

<p align="center">
    <img src="https://raw.githubusercontent.com/afteracademy/nodejs-backend-architecture-typescript/master/addons/github_assets/cover-nodejs-backend.png">
</p>
<br>

## About this Open Source Project
This open-source project is for you(community). Our Team at [AfterAcademy](https://afteracademy.com) has taken this initiative to promote Backend Learning in the best possible way. We are determined to provide quality content for everyone. Let's do it together by learning from this project.

## We will learn and build the backend application for a blogging platform. 
The main focus will be to create a maintainable and highly testable architecture.
<br>
Following are the features of this project:
* **This backend in written in Typescript**: The type safety at build time and having intellisense for it in the IDE like vscode is unparallel to productivity. We have found production bug reduced to significant amount, since most of the code vulnarabilties are identified during the build phase itself.
* **Separation of concern principle is applied**: Each component has been given a particular role. The role of the components are mutually exclusive. This makes the project easy to be unit tested.
* **Feature enpasulation is adopted**: The files or components those are related to a particular feature has been grouped together unless that components is required in multiple features. This enhances the ability to share code across projects.
* **Centralised Error handling is done**: We have created a framework where all the errors are handled centrally. This reduces the ambiguity in the developement when the project grow larger.
* **Centralised Response handling is done**: Similar to Error handling we have response handling framework. This makes it very convinient to apply a common API response pattern.
* **Mongodb is used through Mongoose**: Mongodb really fits very well to the node.js application. Being nosql, fast, and scalable makes it ideal for the modern web applications.
* **Async execution is adopted**: We have used async/await for the promises and made sure to use non blocking version of all the functions with few exceptions.
* **Docker compose has been configured**: We have created the Dockerfile to provide the easy deployability without any setup and configurations. 
* **Unit test is favoured**: The tests has been written to test the functions and routes without the need of the database server. Integration tests has also been done but unit test is favoured.
* **A pure backend project**: We have experienced that when a backend is developed clubed with a frontend then in the future it become really difficult to scale. We would want to create a separate backend project that servers many websites and mobile apps.

## 3RE Architecture: Router, RouteHandler, ResponseHandler, ErrorHandler
<p align="center">
    <img src="https://raw.githubusercontent.com/afteracademy/nodejs-backend-architecture-typescript/master/addons/github_assets/3RE.png">
</p>
<br>

## Project Outline: Blogging Platform
<p align="center">
    <img src="https://raw.githubusercontent.com/afteracademy/nodejs-backend-architecture-typescript/master/addons/github_assets/project-outline.png">
</p>
<br>

## Request-Response Handling Schematic Diagram
<p align="center">
    <img src="https://raw.githubusercontent.com/afteracademy/nodejs-backend-architecture-typescript/master/addons/github_assets/api-structure.png">
</p>
<br>

## Learn the concepts used in this project
* [Design Node.js Backend Architecture like a Pro](https://afteracademy.com/blog/design-node-js-backend-architecture-like-a-pro)
* [The video guide to build and run this project](https://youtu.be/Nwh7wTtUV5I)

## You can find the complete API documentation [here](https://documenter.getpostman.com/view/1552895/SzYUZg52?version=latest)
<a href="https://documenter.getpostman.com/view/1552895/SzYUZg52?version=latest" target="_blank">
    <img src="https://raw.githubusercontent.com/afteracademy/nodejs-backend-architecture-typescript/master/addons/github_assets/api-doc-button.png" width="200" height="60"/>
</a>

## How to build and run this project

* Install using Docker Componse [**Recomended Method**] 
    * Clone this repo.
    * Make a copy of **.env.example** file to **.env**.
    * Make a copy of **keys/private.pem.example** file to **keys/private.pem**.
    * Make a copy of **keys/public.pem.example** file to **keys/public.pem**.
    * Make a copy of **tests/.env.test.example** file to **tests/.env.test**.
    * Install Docker and Docker Compose. [Find Instructions Here](https://docs.docker.com/install/).
    * Execute `docker-compose up -d` in terminal from the repo directory.
    * You will be able to access the api from http://localhost:3000
    * *If having any issue* then make sure 3000 port is not occupied else provide a different port in **.env** file.
    * *If having any issue* then make sure 27017 port is not occupied else provide a different port in **.env** file.
 * Run The Tests
    * Install nodejs and npm on your local machine.
    * From the root of the project execute in terminal `npm install`.
    * *Use latest version of node on local machine if build fails*.
    * To run the tests execute `npm test`.
 * Install Without Docker [**2nd Method**]
    * Install mongodb on your local.
    * Do step 1 to 5 as listed for **Install using Docker Componse**.
    * Do step 1 to 3 as listed for **Run The Tests**.
    * Create users in mongodb and seed the data taking reference from the **addons/init-mongo.js**
    * Change the `DB_HOST` to `localhost` in **.env** and **tests/.env.test** files.
    * Execute `npm start` and You will be able to access the api from http://localhost:3000
    * To run the tests execute `npm test`.
 
 ## Explore Online Tutorials and Courses To Learn More by AfterAcademy
 * [Backend Tutorial](https://afteracademy.com/blogs/backend) - All free tutorials by AfterAcademy
 * [Online Courses for Backend](https://afteracademy.com/courses/backend) - Master the skills that companies love to hire.
 
  ## Learn Backend Development From Our Videos
  * [Introduction to Web Backend Development for Beginners](https://youtu.be/Q0nfLi-4GBg)
  * [Backend System Design for Startups](https://www.youtube.com/playlist?list=PLqOiaH9id5quh5Dph5yuXfdHVGe1LrKvT)
  * [Practical Javascript for Beginners](https://www.youtube.com/playlist?list=PLqOiaH9id5qtw5MhI-C1G3CS7RVZ8ejct)
  
 ## Project Directory Structure
 ```
├── src
│   ├── server.ts
│   ├── app.ts
│   ├── config.ts
│   ├── auth
│   │   ├── apikey.ts
│   │   ├── authUtils.ts
│   │   ├── authentication.ts
│   │   ├── authorization.ts
│   │   └── schema.ts
│   ├── core
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   ├── JWT.ts
│   │   └── Logger.ts
│   ├── database
│   │   ├── index.ts
│   │   ├── model
│   │   │   ├── ApiKey.ts
│   │   │   ├── Blog.ts
│   │   │   ├── Keystore.ts
│   │   │   ├── Role.ts
│   │   │   └── User.ts
│   │   └── repository
│   │       ├── ApiKeyRepo.ts
│   │       ├── BlogRepo.ts
│   │       ├── KeystoreRepo.ts
│   │       ├── RoleRepo.ts
│   │       └── UserRepo.ts
│   ├── helpers
│   │   ├── asyncHandler.ts
│   │   ├── role.ts
│   │   └── validator.ts
│   ├── routes
│   │   └── v1
│   │       ├── access
│   │       │   ├── login.ts
│   │       │   ├── logout.ts
│   │       │   ├── schema.ts
│   │       │   ├── signup.ts
│   │       │   └── token.ts
│   │       ├── blog
│   │       │   ├── blogDetail.ts
│   │       │   ├── blogList.ts
│   │       │   ├── editor.ts
│   │       │   ├── schema.ts
│   │       │   └── writer.ts
│   │       ├── index.ts
│   │       └── profile
│   │           ├── schema.ts
│   │           └── user.ts
│   └── types
│       └── app-request.d.ts
├── tests
│   ├── auth
│   │   ├── apikey
│   │   │   ├── mock.ts
│   │   │   └── unit.test.ts
│   │   ├── authUtils
│   │   │   ├── mock.ts
│   │   │   └── unit.test.ts
│   │   ├── authentication
│   │   │   ├── mock.ts
│   │   │   └── unit.test.ts
│   │   └── authorization
│   │       ├── mock.ts
│   │       └── unit.test.ts
│   ├── core
│   │   └── jwt
│   │       ├── mock.ts
│   │       └── unit.test.ts
│   ├── routes
│   │   └── v1
│   │       ├── blog
│   │       │   ├── blogDetail
│   │       │   │   ├── mock.ts
│   │       │   │   └── unit.test.ts
│   │       │   └── writer
│   │       │       ├── mock.ts
│   │       │       └── unit.test.ts
│   │       ├── login
│   │       │   ├── integration.test.ts
│   │       │   ├── mock.ts
│   │       │   └── unit.test.ts
│   │       └── signup
│   │           ├── mock.ts
│   │           └── unit.test.ts
│   ├── .env.test
│   └── setup.ts
├── addons
│   └── init-mongo.js
├── keys
│   ├── private.pem
│   └── public.pem
├── .env
├── .gitignore
├── .dockerignore
├── .vscode
│   └── launch.json
├── Dockerfile
├── docker-compose.yml
├── package-lock.json
├── package.json
├── jest.config.js
├── tsconfig.json
└── tslint.json
 ```
 
 ## Directory Traversal for Signup API call
 `/src → server.ts → app.ts → /routes/v1/index.ts → /auth/apikey.ts → schema.ts → /helpers/validator.ts → asyncHandler.ts → /routes/v1/signup.ts → schema.ts → /helpers/validator.ts → asyncHandler.ts → /database/repository/UserRepo.ts → /database/model/User.ts → /core/ApiResponses.ts`
 
 ## API Examples
* Signup
    * Method and Headers
    ```
    POST /v1/signup/basic HTTP/1.1
    Host: localhost:3000
    x-api-key: GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj
    Content-Type: application/json
    ```
    * Request Body
    ```json
    {
        "name" : "Janishar Ali",
        "email": "ali@afteracademy.com",
        "password": "changeit",
        "profilePicUrl": "https://avatars1.githubusercontent.com/u/11065002?s=460&u=1e8e42bda7e6f579a2b216767b2ed986619bbf78&v=4"
    }
    ```
    * Response Body: 200
    ```json
    {
      "statusCode": "10000",
      "message": "Signup Successful",
      "data": {
        "user": {
          "_id": "5e7c9d32307a223bb8a4b12b",
          "name": "Janishar Ali",
          "email": "ali@afteracademy.com",
          "roles": [
            "5e7b8acad7aded2407e078d7"
          ],
          "profilePicUrl": "https://avatars1.githubusercontent.com/u/11065002?s=460&u=1e8e42bda7e6f579a2b216767b2ed986619bbf78&v=4"
        },
        "tokens": {
          "accessToken": "some_token",
          "refreshToken": "some_token"
        }
      }
    }
    ```
    * Response Body: 400
    ```json
    {
      "statusCode": "10001",
      "message": "Bad Parameters"
    }
    ```
* Profile Private
    * Method and Headers
    ```
    GET /v1/profile/my HTTP/1.1
    Host: localhost:3000
    x-api-key: GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj
    Content-Type: application/json
    x-access-token: your_token_received_from_signup_or_login
    x-user-id: your_user_id
    ```
    * Response Body: 200
    ```json
    {
      "statusCode": "10000",
      "message": "success",
      "data": {
        "name": "Janishar Ali Anwar",
        "profilePicUrl": "https://avatars1.githubusercontent.com/u/11065002?s=460&u=1e8e42bda7e6f579a2b216767b2ed986619bbf78&v=4",
        "roles": [
          {
            "_id": "5e7b8acad7aded2407e078d7",
            "code": "LEARNER"
          },
          {
            "_id": "5e7b8c22d347fc2407c564a6",
            "code": "WRITER"
          },
          {
            "_id": "5e7b8c2ad347fc2407c564a7",
            "code": "EDITOR"
          }
        ]
      }
    }
    ```

### Find this project useful ? :heart:
* Support it by clicking the :star: button on the upper right of this page. :v:

### License
```
   Copyright (C) 2020 MINDORKS NEXTGEN PRIVATE LIMITED

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```
     
 
