# Verifications

User verifications related functions.

## DB

Take a look at [unicoderns ORM](http://unicoderns.com/docs/ORM/) to know the standard capabilities.

### Model

Available at:

```typescript
import * as verifications from "@unicoderns/cerberus/db/verificationsModel";
```

### Structure

```typescript
export interface Row extends Models.Row {
    id?: number;
    created?: number;
    token: string;
    user: number;
}
```

## Custom capabilities

Soon