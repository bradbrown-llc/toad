import { AIQ } from 'https://deno.land/x/aiq@0.0.0/mod.ts'
import { Lazy } from 'https://deno.land/x/lazy_promise@0.0.1/mod.ts'
import { Snail, SomeSnail } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/snail@0.0.2/mod.ts'

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
        snail.born.then(() => this.#digest(snail.signal))
        const someSnail = Snail.some(snail)
        this.#someSnails.push(someSnail)
        return snail.died
    }

    #digest(signal?:AbortSignal) {
        if (signal?.aborted) return
        const promise = new Promise<void>(r => setTimeout(r, this.delay))
        const lazy:Lazy<void> = () => promise
        const delay = new Snail({ lazy })
        const someSnail = Snail.some(delay)
        this.#someSnails.unshift(someSnail)
    }

}