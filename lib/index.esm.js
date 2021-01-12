import _defineProperty from '@babel/runtime/helpers/defineProperty';

let _Symbol$asyncIterator;

_Symbol$asyncIterator = Symbol.asyncIterator;
class ChangeStreamIterator {
    constructor(model) {
        _defineProperty(this, 'pullQueue', []);

        _defineProperty(this, 'pushQueue', []);

        _defineProperty(this, 'done', false);

        _defineProperty(this, _Symbol$asyncIterator, () => this);

        _defineProperty(this, 'pushValue', async event => {
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
        });

        _defineProperty(
            this,
            'pullValue',
            () =>
                new Promise(resolve => {
                    if (this.pushQueue.length !== 0) {
                        resolve({
                            done: false,
                            value: this.pushQueue.shift(),
                        });
                    } else {
                        this.pullQueue.push(resolve);
                    }
                })
        );

        _defineProperty(this, 'emptyQueue', subscriptionIds => {
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
        });

        _defineProperty(this, 'subscribe', () => this.changeStream.on('change', this.pushValue.bind(this)));

        _defineProperty(this, 'unsubscribe', () => {
            this.changeStream.close();
        });

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
}

export { ChangeStreamIterator };
