# What this API does?

The primary purpose of the API i've built is to streamline user authentication, enabling them to access their respective task lists post-authentication. Additionally, users have the flexibility to perform CRUD operations on each of their tasks. This versatility is provided by the option to use either local accounts stored in a MySQL database or login through Discord, all implemented through passportJS.

## API Documentation

First of all, you **NEED** to be logged in to access any endpoint of the API, you can login either with a local user stored in the database, or with a Discord Account.

### **LOGIN**

If you want to login as a **local user**, access the endpoint `/auth/login` with POST method and provide the following object on the request:

```ts
{
  "username": string,
  "password": string,
}
```

If the user exists in the database, it will maintain a session logged with that user's information.
Otherwise, if the user doesn't exist in the database or the username | password is incorrect, it will return an error.

If you want to login as a **Discord user**, access the endpoint `/auth/discord` with GET method and authorize the Authask Application to get the profile information. There are two situations when you sign in with Discord:

1. It's the first time you're using that Discord Account to authenticate.
2. You have already authenticated with that Discord Account before.

If it's the first time, the API will generate a new record in the DiscordUsers table at MySQL and login; else, it will just search for the discord user in the table and also login. Then, it will return a JSON containing the user's info.

If you want to register a new **local user**, access the endpoint `/auth/signup` with POST method and provide the following object on the request:

```ts
{
  "username": string,
  "password": string,
  "email": string,
}
```

Keep in mind that when registering, there are some validations you must follow in order to maintain things working without issues.

### Username

- Username should not be empty.
- Username is **unique** for each account.
- Username max length is 255 characters.

### Password

There is no max length to the password since it will be hashed into a 60 character long string.

- Password should not be empty.
- Password min length is 8 characters.
- The password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character ( ONLY !@#$%^&*_?. )

### Email

- Email should not be empty.
- Email is **unique** for each account.
- Email should be an email, there is a RegEx testing the string to check if it's valid.

If you fulfill all these validators, the user will be created; otherwise, you will be informed about which validations are missing. Then, it will return a JSON containing the user's info.

### **LOGOUT**

To log out the authenticated user, simply access the `/auth/logout` endpoint using the DELETE method. Upon successful logout, the response will be:

```json
{ 
  "message": "Logged out successfully",
  "loggedOut": true,
}
```

In the event that there is no authenticated user to log out, the response will be:

```json
{ 
  "message": "Failed to logout",
  "loggedOut": false,
}
```

Please be aware that each session has a maximum duration of 4 hours. Every time you log in, a new session is created. Additionally, if there is another active session for the same client, it will be destroyed upon your login. Also when you logout the session cookie is destroyed.

### **Forgot Password**

In case you forgot your local account password, you can access the endpoint `email/send-token` with POST method, providing in the body the registered email from your account.

If the email isn't from any user on the local DB, you'll receive a Http Error with invalid credentials. Else, you'll receive a message saying that a token was sent to your email.

**NOTICE** that each token expires after 10 minutes, after that you'll need to request a new token.

After receiving the email, access the endpoint `auth/reset-password` with POST method, in the body you should provide:

```ts
{
  "password": string,
  "token": string
}
```

- The password must respect the same rules implied while creating a user.
- The token is just the token you received on your email.

If the token and the new password are valid, you will receive a message.

```json
{ 
  "message": "Password changed successfully" 
}
```

### **After authenticaion**

### Get Tasks

To get all the tasks from the authenticated user, access the endpoint `/tasks` with a GET method, it will return an array of the following object:

```ts
{
  "id": number,
  "title": string,
  "description": string,
  "status": "OPEN" | "IN_PROGRESS" | "DONE",
  "urgent": boolean,
  "startsAt": Date,
  "endsAt": Date,
  "createdAt": Date,
}
```

The id and createdAt fields are inserted automatically by the API, the other properties can be manipulated by the client.

### Create Task

In order to create a task, access the endpoint `/tasks` with a POST method an object containing the new task properties will be returned, and the client should provide the following object:

```ts
{
  "title": string,
  "description": string,
  "status": 'OPEN' | 'IN_PROGRESS' | 'DONE',
  "urgent": boolean,
  "startsAt": Date | null,
  "endsAt": Date | null,
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

StartsAt is optional, however, if the user doesn't provide a Date the API will set the value to a new Date instance when the task is created.

- startsAt should be a Date, if provided.
- Should follow ISO-8601: "YYYY-MM-DDTHH:MM:SS.sssZ";
- Must be a valid date, otherwise, server will send error for cases like 2023-02-31.
- Min and Max dates are: 1900-01-01T00:00:00.000Z, 2099-12-31T23:59:59.999Z.

#### endsAt

EndsAt is optional, however, if the user doesn't provide a Date the API will set the value to a new Date instance when the task is created and add 1 day.

- endsAt should be a Date, if provided.
- Should follow ISO-8601: "YYYY-MM-DDTHH:MM:SS.sssZ".
- Must be a valid date, otherwise, server will send error for cases like 2023-02-31.
- Min and Max dates are: 1900-01-01T00:00:00.000Z, 2099-12-31T23:59:59.999Z.

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
- CLIENT_ORIGIN_URL
- EMAIL_USER
- EMAIL_PASS

CLIENT_ORIGIN_URL is the base origin of the client, in my case i'm using angular so it's ``http://localhost:4200``.

Since SESSION_SECRET is crucial for security, you can generate the secret with the following built-in Node.js function:

```ts
require('crypto').randomBytes(64).toString('hex');
```

Copy the value it returns and paste it into the SESSION_SECRET variable.

`EMAIL_USER` and `EMAIL_PASS` are related to the email account that will send the tokens when a local user forgets a password. YOU MUST USE A **OUTLOOK** ACCOUNT IN ORDER TO WORK, i recommend creating a new account just for testing purposes, do not use your personal account.

### 4 - Setup Discord Application

As you may have noticed, there are some environment variables related to Discord. That's because this API allows users to login with a Discord account.

Go to discord.com/developers, create an application, and set up the CLIENT_ID, CLIENT_SECRET, and REDIRECT_URI. This part is simple, but **PAY ATTENTION** to the REDIRECT_URI. In my Discord application, i specified in the auth.controller that the endpoint would be `auth/discord/redirect`, as shown in the following code:

```ts
@UseGuards(UnifiedAuthGuard)
@Get('discord/redirect')
async discordRedirect(@Req() req: Request) {
  // authorized
  return `
  <script>
    window.opener.postMessage(${JSON.stringify(req.user)}, 
    "${process.env.CLIENT_ORIGIN_URL}/login");
    window.close();
  </script>`;
}
```

If you set it to a different endpoint, you must change the `@Get('discord/redirect')` to match the redirect you specified in your application and also update the script URL to where you initialized the login with discord process.

### 5 - Run the API

If you've followed all the steps correctly, simply execute the command `npm run start:dev` in your terminal, and the API should run without any issues. Should you encounter any difficulties while setting up the API, don't hesitate to reach out for assistance. I'm here to help :).

## Tools used to build the API

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PassportJS](https://www.passportjs.org/)
- [MySQL](https://www.mysql.com/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Nodemailer](https://nodemailer.com/)
- [Discord for Developers](https://discord.com/developers)
- [GitHub Copilot](https://github.com/features/copilot)

## Difficulties

I had some problem with the passport-discord strategy, since i didn't find out how i could handle errors when the user doesn't authorize the discord application to access it's information, it just stays at `auth/discord/redirect` with a {"message":"Unauthorized","statusCode":401}. But when authorized, the client gets the discord user info. I even asked for help on stackoverflow, but untill the day of this commit i still didn't get an answer.

MIT License - Copyright (c) 2023, gutoPsilva.
