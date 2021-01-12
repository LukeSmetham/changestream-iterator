# ChangeStreamIterator

Super simplate wrapper around Mongoose Change Streams to produce an ES6 AsyncIterator that will wait for events.

This allows you to use the iterator standalone in any supported environment, or pass to Apollo to create realtime graphql subscriptions based on a Change Stream.

`pseudo-code example`:

```js
import { UserModel } from './models';

const changeStream = new ChangeStreamIterator(UserModel);

for await (const event of changeStream) {
    console.log('User model event:', event);
}
```

> WIP: Currently has no way to configure the change stream/pipeline etc. Just purely creates an asynchronously iterable Mongoose Change Stream for a given collection.
