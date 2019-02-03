# Users

Users related functions.

## DB

Take a look at [unicoderns ORM](http://unicoderns.com/docs/ORM/) to know the standard capabilities.

### Model

Available at:

```typescript
import * as users from "@unicoderns/cerberus/db/usersModel";
```

### Structure

```typescript
export interface Row extends Models.Row {
    id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    firstName?: string;
    lastName?: string;
    timezone?: number;
    admin?: boolean;
    verified?: boolean;
    active?: boolean;
}
```

## Custom capabilities

### signup

Create a new user.

Receives an object with an user, email and password.

It returns an json object.

```typescript
cerberus.sessions.signup({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
}).then((reply) => {
    // Set cookie
    console.log({
        success: reply.success,
        message: reply.message,
        user: reply.user
    });
}).catch((reply) => {
    if (typeof reply.err !== "undefined") {
        console.error(reply.err);
    }
    console.error({
        success: reply.success,
        message: reply.message,
        error: reply.err
    });
});
```