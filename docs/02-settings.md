# Settings

Library and connection settings.

```typescript
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

## dev

Developer mode. | `boolean`

## token

Secret token, extra security for encripted data. | `string`

## db

Unicoderns ORM connection. | `unicoderns orm connection`

## settings

### expiration

expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms). Eg: 60, "2 days", "10h", "7d". | `string`

### session

Kind of token. | `string`

* `stateless` (Stateless JSON Web Token) is a self-contained token which does not need any representation on the backend.
* `stateful` (Stateful JSON Web Token | Recomended) is a token which contains only part of the required data, f.e. session/user ID and the rest is stored on the server side.