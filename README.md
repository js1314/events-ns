# events-ns

node events namespace Support~

# Examples

## EventEmitterNS

<pre>
//test function
function test1() {}
function test2() {}
function test3() {}

//add
let eventNs = new EventEmitterNS()
eventNs.addListener('ns.click1', test1)
eventNs.addListener('ns.click2', test2)
eventNs.addListener('ns.click3', test3)

//removeAllListeners for namespace
eventNs.removeAllListenersNS('ns')
console.log(eventNs)

</pre>

## CallbackQueue

<pre>

//test function
async function test1() {
	console.log('test1', Date.now(), this)
	await new Promise((resolve) => {
		setTimeout(() => {
			console.log('test1 async', Date.now(), this)
			resolve()
		}, 1000)
	})
}

async function test2() {
	console.log('test2', Date.now(), this)
	await new Promise((resolve) => {
		setTimeout(() => {
			console.log('test2 async', Date.now(), this)
			resolve()
		}, 1000)
	})
}

async function test3() {
	console.log('test3', Date.now(), this)
	await new Promise((resolve) => {
		setTimeout(() => {
			console.log('test3 async', Date.now(), this)
			resolve()
		}, 1000)
	})
}

let callbackQueue = new CallbackQueue()

console.log('call begin --------------')
callbackQueue.push(test1)
callbackQueue.push(test2)
callbackQueue.push(test3)
callbackQueue.call()
console.log('call end --------------')

console.log('asyncCall begin --------------')
callbackQueue.push(test1)
callbackQueue.push(test2)
callbackQueue.push(test3)
callbackQueue.asyncCall()
console.log('asyncCall end --------------')

console.log('delay begin --------------')
callbackQueue.push(test1)
callbackQueue.push(test2)
callbackQueue.push(test3)
callbackQueue.delay(3000)
console.log('delay end --------------')

console.log('asyncDelay begin --------------')
callbackQueue.push(test1)
callbackQueue.push(test2)
callbackQueue.push(test3)
callbackQueue.asyncDelay(3000)
console.log('asyncDelay end --------------')

</pre>

## v1.0.8

1. Rename `Stack` => `Queue`
2. Add `Stack`

## v1.0.9

1. fix `operator` undefined

## v1.1.0

1. fix `CallbackQueue.asyncCall` wrong
2. fix `CallbackQueue.asyncDelay` wrong
3. Add Examples from `CallbackQueue`