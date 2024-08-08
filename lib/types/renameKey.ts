import { map, chain } from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/function'
import * as t from 'io-ts'

export const renameKey =
    <KA extends string, KO extends string>(from: KA, to: KO) =>
    <A extends t.Any>(a: A) =>
        new t.Type<t.TypeOf<A>, Record<string, unknown>>(
            a.name,
            a.is,
            (i, c) =>
                pipe(
                    t.record(t.string, t.unknown).validate(i, c),
                    map(b => {
                        if (Object.prototype.hasOwnProperty.call(b, from)) {
                            b[to] = b[from]
                            delete b[from]
                        }
                        return b
                    }),
                    chain(b => a.validate(b, c))
                ),
            flow(a.encode, b => {
                if (Object.prototype.hasOwnProperty.call(b, to)) {
                    b[from] = b[to]
                    delete b[to]
                }
                return b
            })
        )
