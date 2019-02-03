# Unicoderns Cerberus
### Security and authentication

Premise based typescript package that allow you to secure resources in your project.

## Quick start

Create the cerberus sql tables into your database, provide the [settings](02-settings.md) and start securing resources.

```typescript
import Cerberus from "@unicoderns/cerberus";

let cerberus = new Cerberus({
    dev: true,
    token: "magicisallaroundus",
    DB: ORM.db,
    settings: {
        expiration: "1d",
        session: "stateful"
    }
});
```

## Available Modules

Cerberus models are powered by [unicoderns ORM](http://unicoderns.com/docs/ORM/), therefore they includes standard capabilities and add some custom ones.

* [Sessions](03-modules/02-sessions.md)
* Users
* Verifications
* Resources (Coming Soon)
* Resources Permissions (Coming Soon)