# ChangeStreamIterator

Super simple wrapper around Mongoose Change Streams to produce an ES6 AsyncIterator that will wait for events.

This allows you to use the iterator standalone in any supported environment, or pass to Apollo as the subscriber method of a Subscription resolver to create realtime graphql subscriptions for your MongoDB documents.


```js
import { ChangeStreamIterator } from 'changestream-iterator';
import db from './db';


const userChangeIterator = db.collection('users').watch(undefined, { fullDocument: 'updateLookup' });
const changeStream = new ChangeStreamIterator([userChangeIterator]);


for await (const event of changeStream) {
    console.log('CHANGE:', event);

}
```
