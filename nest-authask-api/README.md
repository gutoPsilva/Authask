# What this API does?

The primary purpose of the API i've built is to streamline user authentication, enabling them to access their respective task lists post-authentication. Additionally, users have the flexibility to perform CRUD operations on each of their tasks. This versatility is provided by the option to use either local accounts stored in a MySQL database or login through Discord, all implemented through passportJS.

## API Documentation

First of all, you **NEED** to be logged in to access any endpoint of the API, you can login either with a local user stored in the database, or with a Discord Account.

### **LOGIN**

If you want to login as a **local user**, access the endpoint `/auth/login` with POST method and provide the following object on the request:

```json
{
  "username": string,
  "password": string
}
```

If the user exists in the database, it will maintain a session logged with that user's information.
Otherwise, if the user doesn't exist in the database or the username | password is incorrect, it will return an error.

If you want to login as a **Discord user**, access the endpoint `/auth/discord` with GET method and authorize the Authask Application to get the profile information. There are two situations when you sign in with Discord:

1. It's the first time you're using that Discord Account to authenticate.
2. You have already authenticated with that Discord Account before.

If it's the first time, the API will generate a new record in the DiscordUsers table at MySQL and login; else, it will just search for the discord user in the table and also login.

If you want to register a new **local user**, access the endpoint `/auth/register` with POST method and provide the following object on the request:

```json
{
  "username": string,
  "password": string,
  "email": string
}
```

Keep in mind that when registering, there are some validations you must follow in order to maintain things working without issues.

### Username

The username field is **unique** in the database and since MySQL is case-insensitive, you can't register a new username 'gutopsilva' if the database already has a user named 'GutoPSilva' or its variants. **The same applies to EMAIL!**

- Username should not be empty.
- Username max length is 255 characters.

### Password

There is no max length to the password since it will be hashed into a 60 character long string.

- Password should not be empty.
- Password min length is 8 characters.
- The password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character ( ONLY !@#$%^&\*-\_?. )

### Email

The email field is **unique** in the database, same as the username field.

- Email should not be empty.
- Email should be an email, there is a RegEx testing the string to check if it's valid.

If you fulfill all these validators, the user will be created; otherwise, you will be informed about which validations are missing.

### **LOGOUT**

To log out the authenticated user, simply access the `/auth/logout` endpoint using the POST method. Upon successful logout, the response will be 'Logged out successfully.' In the event that there is no authenticated user to log out, the response will be 'No user to logout.'

Please be aware that each session has a maximum duration of 4 hours. Every time you log in, a new session is created. Additionally, if there is another active session for the same client, it will be destroyed upon your login.

### **After authenticaion**

### Get Tasks

To get all the tasks from the authenticated user, access the endpoint `/tasks` with a GET method, it will return an array of the following object:

```json
{
  "id": number,
  "title": string,
  "description": string,
  "status": 'OPEN' | 'IN_PROGRESS | 'DONE',
  "urgent": boolean,
  "startsAt": Date,
  "endsAt": Date | null,
  "createdAt": Date
}
```

The id and createdAt fields are inserted automatically by the API, the other properties can be manipulated by the client.

### Create Task

In order to create a task, access the endpoint `/tasks` with a POST method an object containing the new task properties will be returned, and the client should provide the following object:

```json
{
  "title": string,
  "description": string,
  "status": 'OPEN' | 'IN_PROGRESS | 'DONE',
  "urgent": boolean,
  "startsAt": Date | null,
  "endsAt": Date
}
```

The tasks have validations like the user authentication, and they are:

#### Title

A title for the task.

- Title should not be empty.
- Title max length is 255.

#### Description

A description about the task.

- Description should not be empty.
- Description max length is 255.

#### Status

A status representing the situation of the task.

- Status should not be empty.
- Status should be in ['OPEN', 'IN_PROGRESS', 'DONE'].

#### Urgent

A urgent property to set the priority of the task.

- Should not be empty.
- Should be boolean.

#### startsAt

StartsAt is optional however, if the user doesn't provide a Date the API will set the value to a new Date instance when the task is created.

- startsAt should be a Date, if provided.

#### endsAt

EndsAt is optional, however it can assume a null value.

- endsAt should be a Date, if provided.

### Update Task

To update a task, adhere to the validation criteria outlined in the "Create Task" section for the respective fields. Access the ``/tasks/:id`` endpoint using the PUT method, where :id should correspond to the task's id. The endpoint should return the object with the properties updated. All properties are optional, and the task will only update the provided values.

However, it's important to note that if the task you intend to modify does not belong to the currently authenticated user, you lack the authorization to manipulate it.

### Delete Task

To delete a task, use the DELETE method on the ``/tasks/:id`` endpoint, where :id should match the task's identifier. If the task was deleted, it should return `true`, else, returns `false`.

Similar to updating a task, it's important to highlight that deletion is only permissible if the task is associated with the authenticated user.

## Copying the API

If you want to copy and use the functionalities from this API, you must follow these steps.
First, clone this Git repository, and then:

### 1 - Install Node Modules

Simply run `npm install` in your terminal.

### 2 - Create a MySQL Database

You can use the terminal but i find it easier to create the database with MySQL Workbench, it's actually what i did.

Just execute the following command:

```mysql
CREATE DATABASE db_name;
```

The TypeORM entities in this API will automatically create the tables and their fields, so don't worry about that.

### 3 - Setup Environment Variables

I used dotenv to setup the environment variables. Create a '.env' file in the root directory and fill in the following variables:

- APP_PORT
- SESSION_SECRET
- DISCORD_CLIENT_ID
- DISCORD_CLIENT_SECRET
- DISCORD_REDIRECT_URI
- DB_PORT
- DB_HOST
- DB_USER
- DB_PASS
- DB_NAME

Since SESSION_SECRET is crucial for security, you can generate the secret with the following built-in Node.js function:

```js
require('crypto').randomBytes(64).toString('hex');
```

Copy the value it returns and paste it into the SESSION_SECRET variable.

### 4 - Setup Discord Application

As you may have noticed, there are some environment variables related to Discord. That's because this API allows users to login with a local strategy using the MySQL database or with a Discord account.

Go to discord.com/developers, create an application, and set up the CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI. This part is simple, but **PAY ATTENTION** to the REDIRECT_URI. In my Discord application, i specified in the auth.controller that the endpoint would be `auth/discord/redirect`, as shown in the following code:

```js
@UseGuards(DiscordAuthGuard)
@Get('discord/redirect')
async discordRedirect() {
  return HttpStatus.OK;
}
```

If you set it to a different endpoint, you must change the `@Get('discord/redirect')` to match the redirect you specified in your application.

### 5 - Run the API

If you've followed all the steps correctly, simply execute the command `npm run start:dev` in your terminal, and the API should run without any issues. Should you encounter any difficulties while setting up the API, don't hesitate to reach out for assistance. I'm here to help :).

## Tools used to build the API

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PassportJS](https://www.passportjs.org/)
- [MySQL](https://www.mysql.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Discord for Developers](https://discord.com/developers)
- [GitHub Copilot](https://github.com/features/copilot)

MIT License - Copyright (c) 2023, gutoPsilva.
