export class ChangeStreamIterator {
    pullQueue = [];

    pushQueue = [];

    done = false;

    constructor(model) {
        this.changeStream = model.watch();
        this.pullQueue = [];
        this.pushQueue = [];
        this.listening = true;

        this.subscription = this.subscribe();
    }

    async next() {
        await this.subscription;

        return this.listening ? this.pullValue() : this.return();
    }

    async throw(error) {
        this.emptyQueue(await this.subscription);

        return Promise.reject(error);
    }

    async return() {
        this.emptyQueue(await this.subscription);

        return {
            done: true,
            value: undefined,
        };
    }

    [Symbol.asyncIterator] = () => this;

    pushValue = async event => {
        await this.subscription;

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

    emptyQueue = subscriptionIds => {
        if (this.listening) {
            this.listening = false;
            this.unsubscribe(subscriptionIds);
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

    subscribe = () => this.changeStream.on('change', this.pushValue.bind(this));

    unsubscribe = () => {
        this.changeStream.close();
    };
}
