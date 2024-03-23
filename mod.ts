import { AIQ } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/aiq@0.0.0/mod.ts'
import { Lazy } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/lazy@0.0.0/mod.ts'
import { Snail, SomeSnail } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.0/mod.ts'
import { KvCache } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/kvcache@0.0.2-vertigo/mod.ts'

export class Toad {

    c_delay:KvCache<number>
    #someSnails:AIQ<SomeSnail>

    constructor(kvCache:KvCache<number>) {
        this.c_delay = kvCache
        this.#someSnails = new AIQ<SomeSnail>()
        this.eat()
    }

    async eat() {
        for await (const someSnail of this.#someSnails)
            await someSnail(<T>(snail:Snail<T>) => snail.lazy().catch(() => {}))         
    }

    feed<T>(snail:Snail<T>) {
        snail.born.then(async () => await this.#digest())
        const someSnail = Snail.some(snail)
        this.#someSnails.push(someSnail)
        return snail.died
    }

    async #digest() {
        const delay = await this.c_delay.get()
        const promise = new Promise<void>(r => setTimeout(r, delay))
        const lazy:Lazy<void> = () => promise
        const snail = new Snail(lazy)
        const someSnail = Snail.some(snail)
        this.#someSnails.unshift(someSnail)
    }

}