export class ChangeStreamIterator {
    pullQueue = [];

    pushQueue = [];

    done = false;

    constructor(changeStream) {
        this.pullQueue = [];
        this.pushQueue = [];
        this.listening = true;

        this.changeStreams = Array.isArray(changeStream) ? changeStream : [changeStream];

        this.subscriptions = this.subscribeAll();
    }

    async next() {
        await this.subscriptions;

        return this.listening ? this.pullValue() : this.return();
    }

    async throw(error) {
        this.emptyQueue(await this.subscriptions);

        return Promise.reject(error);
    }

    async return() {
        this.emptyQueue(await this.subscriptions);

        return {
            done: true,
            value: undefined,
        };
    }

    [Symbol.asyncIterator] = () => this;

    pushValue = async event => {
        await this.subscriptions;

        if (this.pullQueue.length !== 0) {
            const element = this.pullQueue.shift();

            if (element) {
                element({
                    value: event,
                    done: false,
                });
            }
        } else {
            this.pushQueue.push(event);
        }
    };

    pullValue = () =>
        new Promise(resolve => {
            if (this.pushQueue.length !== 0) {
                resolve({
                    done: false,
                    value: this.pushQueue.shift(),
                });
            } else {
                this.pullQueue.push(resolve);
            }
        });

    emptyQueue = subscriptions => {
        if (this.listening) {
            this.listening = false;
            this.unsubscribeAll(subscriptions);
            this.pullQueue.forEach(resolve =>
                resolve({
                    done: true,
                    value: undefined,
                })
            );
            this.pullQueue.length = 0;
            this.pushQueue.length = 0;
        }
    };

    subscribeAll = () => Promise.all(this.changeStreams.map(stream => stream.on('change', this.pushValue.bind(this))));

    unsubscribeAll = subscriptions => {
        for (const subscription of subscriptions) {
            subscription.close();
        }
    };
}
