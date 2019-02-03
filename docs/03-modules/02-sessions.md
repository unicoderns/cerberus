# Sessions

Sessions related functions.

## DB

Take a look at [unicoderns ORM](http://unicoderns.com/docs/ORM/) to know the standard capabilities.

### Model

Available at:

```typescript
import * as sessions from "@unicoderns/cerberus/db/sessionsModel";
```

### Structure

```typescript
export interface Row extends Models.Row {
    id?: number;
    created?: number;
    ip: string;
    user: number;
}
```

## Custom capabilities

### create

Receives an object with an email and a password, verifies if they exists and match from the ones in the database, then, if all is clear, creates an auth token for that user.

It returns an json object.

```typescript
cerberus.sessions.create({
    email: req.body.email,
    password: req.body.password
}).then((reply) => {
    // Set cookie
    console.log({
        success: reply.success,
        message: reply.message,
        token: reply.token
    });
}).catch((reply) => {
    if (typeof reply.err !== "undefined") {
        console.error(reply.err);
    }
    console.error({
        success: reply.success,
        message: reply.message
    });
});
```

### renew

Receives a user object, and renew an auth token for that user.

It returns an json object.

```typescript
console.log(
    cerberus.sessions.renew(user)
);
```

### revoke

Receives an user id and remove a stateful session from the system.

It returns an json object.

```typescript
cerberus.sessions.revoke(userID).then((reply) => {
    // Expire cookie
    console.log({
        success: reply.success,
        message: reply.message,
        token: reply.token
    });
}).catch((reply) => {
    if (typeof reply.err !== "undefined") {
        console.error(reply.err);
    }
    console.error({
        success: reply.success,
        message: reply.message
    });
});
```