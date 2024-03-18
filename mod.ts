import { AIQ } from 'https://deno.land/x/aiq@0.0.0/mod.ts'

export interface Lazy<T> { ():Promise<T> }

export class Gate<T> {

    promise:Promise<T>
    resolve:(value:T)=>void
    reject:(reason:unknown)=>void

    constructor() {
        const { promise, resolve, reject } = Promise.withResolvers<T>()
        this.promise = promise
        this.resolve = resolve
        this.reject = reject
    }

}

export type SomeSnail = <R>(f:<T>(Snail:Snail<T>)=>R)=>R

export class Snail<T> {

    lazy:Lazy<T>
    born:Promise<void>
    died:Promise<T>

    constructor(lazy:Lazy<T>) {
        const bornGate = new Gate<void>()
        const diedGate = new Gate<T>()
        this.born = bornGate.promise
        this.died = diedGate.promise
        this.lazy = () => {
            bornGate.resolve()
            lazy()
                .then(diedGate.resolve)
                .catch(reason => { diedGate.reject(reason) })
            return diedGate.promise
        }
    }

    static some<T>(snail:Snail<T>):SomeSnail { return f => f(snail) } 

}

export class Toad {

    delay:number
    #someSnails:AIQ<SomeSnail>

    constructor(delay:number) {
        this.delay = delay
        this.#someSnails = new AIQ<SomeSnail>()
        this.eat()
    }

    async eat() {
        for await (const someSnail of this.#someSnails)
            await someSnail(<T>(snail:Snail<T>) => snail.lazy())
                .catch(() => {})
    }

    feed<T>(snail:Snail<T>) {
        snail.born.then(() => this.#digest())
        const someSnail = Snail.some(snail)
        this.#someSnails.push(someSnail)
        return snail.died
    }

    #digest() {
        const promise = new Promise<void>(r => setTimeout(r, this.delay))
        const lazy:Lazy<void> = () => promise
        const delay = new Snail(lazy)
        const someSnail = Snail.some(delay)
        this.#someSnails.unshift(someSnail)
    }

}