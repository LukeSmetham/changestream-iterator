'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _defineProperty = require('@babel/runtime/helpers/defineProperty');

function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
}

var _defineProperty__default = /*#__PURE__*/ _interopDefaultLegacy(_defineProperty);

let _Symbol$asyncIterator;

_Symbol$asyncIterator = Symbol.asyncIterator;
class ChangeStreamIterator {
    constructor(model) {
        _defineProperty__default['default'](this, 'pullQueue', []);

        _defineProperty__default['default'](this, 'pushQueue', []);

        _defineProperty__default['default'](this, 'done', false);

        _defineProperty__default['default'](this, _Symbol$asyncIterator, () => this);

        _defineProperty__default['default'](this, 'pushValue', async event => {
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

        _defineProperty__default['default'](
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

        _defineProperty__default['default'](this, 'emptyQueue', subscriptionIds => {
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

        _defineProperty__default['default'](this, 'subscribe', () => this.changeStream.on('change', this.pushValue.bind(this)));

        _defineProperty__default['default'](this, 'unsubscribe', () => {
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

exports.ChangeStreamIterator = ChangeStreamIterator;
