import { EventEmitter } from 'events'

/**
 * 不需要使用命名空间或堆的话请尽量使用 EventEmitter
 */
function EventEmitterNS(options) {
	this.options = options || {}
	this.events = {}
}

/**
 * 根据.连接的路径初始化对象值
 *
 * @param {Object} data 目标对象
 * @param {String} path 目标路径
 */
function _initQueue(data, path, options) {
	var ps = path.split('.'),
		ns = ps.pop(),
		ss = ps.join('.') || ns
	return [ns, (data[ss] = data[ss] || new EventEmitter(options))]
}

EventEmitterNS.prototype = {
	//以下是自行扩展的，方便批量操作
	removeAllListenersNS(ns) {
		if (arguments.length === 0) {
			for (var path in this.events) delete this.events[path]
		} else {
			for (var path in this.events) {
				if (path === ns || path.indexOf(ns + '.') === 0) {
					delete this.events[path]
					break
				}
			}
		}
		return this
	},
	//以下方法都是EventEmitter中已存在的，只是将它们封装成queue
	addListener(path, listener) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.addListener(event, listener)
	},
	on(path, listener) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.on(event, listener)
	},
	once(path, listener) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.once(event, listener)
	},
	removeListener(path, listener) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.removeListener(event, listener)
	},
	off(path, listener) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.off(event, listener)
	},
	removeAllListeners(path) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.removeAllListeners(event)
	},
	setMaxListeners(path, n) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.setMaxListeners(n)
	},
	getMaxListeners(path) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.getMaxListeners()
	},
	listeners(path) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.listeners(event)
	},
	rawListeners(path) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.rawListeners(event)
	},
	emit(path, args) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.emit(event, args)
	},
	listenerCount(path) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.listenerCount(event)
	},
	prependListener(path, listener) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.prependListener(event, listener)
	},
	prependOnceListener(path, listener) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.prependOnceListener(event, listener)
	},
	eventNames(path) {
		var [event, eventer] = _initQueue(this.events, path, this.options)
		return eventer.eventNames()
	}
}

/**
 * 事件队列管理, EventListener
 */
function EventListenerQueue(queue) {
	this.queue = queue || []
	this._queue = queue ? queue.slice(0) : []
	this.operator = 'push'
}

/**
 * 事件栈管理
 */
function EventListenerStack(stack) {
	this.queue = stack || []
	this._queue = stack ? stack.slice(0) : []
	this.operator = 'unshift'
}

EventListenerStack.prototype = EventListenerQueue.prototype = {
	push(target, event, handle, args) {
		let queue = [target, event, handle, args]
		this.queue[this.operator](queue)
		this._queue[this.operator](queue)
		return this
	},
	addEventListener() {
		let queue = this._queue.shift()
		queue && (queue[0].addEventListener(queue[1], queue[2], queue[3]), this.addEventListener())
		return this
	},
	removeEventListener() {
		let queue = this._queue.shift()
		queue && (queue[0].removeEventListener(queue[1], queue[2], queue[3]), this.removeEventListener())
		return this
	},
	removeAllEventListeners() {
		let queue = this.queue.shift()
		queue && (queue[0].removeEventListener(queue[1], queue[2], queue[3]), this.removeAllEventListeners())
		return this
	}
}

/**
 * 事件队列管理, Listener
 */
function EventEmitterQueue(queue) {
	this.queue = queue || []
	this._queue = queue ? queue.slice(0) : []
	this.operator = 'push'
}

function EventEmitterStack(stack) {
	this.queue = stack || []
	this._queue = stack ? stack.slice(0) : []
	this.operator = 'unshift'
}

EventEmitterStack.prototype = EventEmitterQueue.prototype = {
	push(target, event, handle, args) {
		let queue = [target, event, handle, args]
		this.queue[this.operator](queue)
		this._queue[this.operator](queue)
		return this
	},
	addListener() {
		let queue = this._queue.shift()
		queue && (queue[0].addListener(queue[1], queue[2], queue[3]), this.addListener())
		return this
	},
	removeListener() {
		let queue = this._queue.shift()
		queue && (queue[0].removeListener(queue[1], queue[2], queue[3]), this.removeListener())
		return this
	},
	removeAllListeners() {
		let queue = this.queue.shift()
		queue && (queue[0].removeListener(queue[1], queue[2], queue[3]), this.removeAllListeners())
		return this
	}
}

/**
 * 回调队列管理，方便批量操作
 */
function CallbackQueue(queue) {
	this.queue = queue || []
	this.operator = 'push'
}

/**
 * 回调栈管理，方便批量操作
 */
function CallbackStack(stack) {
	this.queue = stack || []
	this.operator = 'unshift'
}

CallbackStack.prototype = CallbackQueue.prototype = {
	push(callback) {
		this.queue[this.operator](callback)
		return this
	},
	call(context, ...args) {
		let queue = this.queue.shift()
		queue && (queue.apply(context, ...args), this.call())
		return this
	},
	async asyncCall(...args) {
		let queue = this.queue.shift()
		queue && (await queue(...args), await this.asyncCall(...args))
		return this
	},
	delay(timeout, context, args) {
		let queue = this.queue.shift()
		queue && (setTimeout(queue.bind(context, args), timeout), this.delay(timeout, context, args))
		return this
	},
	async asyncDelay(timeout, ...args) {
		let queue = this.queue.shift()
		queue && (await queue(...args), setTimeout(() => this.asyncDelay(timeout, ...args), timeout))
		return this
	},
	request(context, ...args) {
		let queue = this.queue.shift()
		queue && (requestAnimationFrame(queue.bind(context, ...args)), this.request(context, ...args))
		return this
	}
}

/**
 * Export
 */
export {
	EventEmitter,
	EventEmitterNS,
	EventEmitterQueue,
	EventListenerQueue,
	CallbackQueue,
	EventEmitterStack,
	EventListenerStack,
	CallbackStack
}
