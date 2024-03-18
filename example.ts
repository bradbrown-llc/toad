import { Toad, Snail } from './mod.ts'

const toad = new Toad(0)

const lazyL = () => fetch('http://google.cpm')
const lazyR = () => fetch('http://google.com')

const snailL = new Snail(lazyL)
const snailR = new Snail(lazyR)

snailL.born.then(() => console.log(Date.now(), 'snailL born'))
snailR.born.then(() => console.log(Date.now(), 'snailR born'))
snailL.died.finally(() => console.log(Date.now(), 'snailL died')).catch(() => {})
snailR.died.finally(() => console.log(Date.now(), 'snailR died')).catch(() => {})

toad.feed(snailL)
    .then(value => console.log(Date.now(), ':)', typeof value))
    .catch(() => console.log(Date.now(), ':('))
toad.feed(snailR)
    .then(value => console.log(Date.now(), ':)', typeof value))
    .catch(() => console.log(':('))