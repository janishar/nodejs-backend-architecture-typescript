# NodeJs Backend Architecture Typescript Project
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
* **Separation of concern principle is applied**: Each component has been given a particular role. The role of the components are mutually excllusive. This makes the project easy to be unit tested.
* **Feature enpasulation is adopted**: The files or components those are related to a particular feature has been grouped together unless that components is required in multiple features.This enhances the ability to share code across projects.
* **Centralised Error handling is done**: We have created a framework where all the error is handled centrally. This reduces the abiguity in the developement when the project grows larger.
* **Centralised Response handling is done**: Similar to Error handling we have response handling framework. This makes it very convinient to apply a common API response pattern.
* **Mongodb is used through Mongoose**: Mongodb really fits very well to the nodejs application. Being nosql, fast, and scalable makes it ideal for the modern web applications.
* **Async execution is adopted**: We have used async/await for the promises and made sure to use non blocking version of all the functions with few exceptions.
* **Docker compose has been configured**: We Dockerfile has been created to assist in easy deployability without setup and much configurations. 
* **Unit test is favoured**: The tests has been written to test the functions and routes without the need of the database server. Integration tests has also been done but unit test is favoured.

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



### Important
Use latest version of node on local machine
