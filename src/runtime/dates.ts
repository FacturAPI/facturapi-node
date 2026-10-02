import { datePlans } from '../generated/dates'

export type DatePlan =
  | { kind: 'none' | 'date' | 'date-time' }
  | { kind: 'object'; properties: Record<string, number>; additional?: number }
  | { kind: 'array'; items: number }
  | {
      kind: 'union'
      variants: { plan: number; match: Record<string, (string | number)[]> }[]
    }

const isoDate =
  /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/

export function deserializeResponseDates(value: unknown, planId = 0): unknown {
  const plan: DatePlan = datePlans[planId]
  if (!plan || !value || value instanceof Date) return value
  if (plan.kind === 'date' || plan.kind === 'date-time') {
    if (typeof value !== 'string' || !isoDate.test(value)) return value
    if (plan.kind === 'date-time' && !value.includes('T')) return value
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date
  }
  if (plan.kind === 'array') {
    return Array.isArray(value)
      ? value.map((item) => deserializeResponseDates(item, plan.items))
      : value
  }
  if (typeof value !== 'object' || Array.isArray(value)) return value
  if (plan.kind === 'union') {
    // Prefer constrained variants (e.g. type=pago) before an opaque custom
    // complement. Unrecognized custom objects keep their original contents.
    const variant =
      plan.variants.find(
        (variant) =>
          Object.keys(variant.match).length &&
          Object.entries(variant.match).every(
            ([key, allowed]) =>
              key in value && allowed.includes(Reflect.get(value, key)),
          ),
      ) || plan.variants.find((variant) => !Object.keys(variant.match).length)
    return variant ? deserializeResponseDates(value, variant.plan) : value
  }
  if (plan.kind === 'object') {
    for (const [key, child] of Object.entries(plan.properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key))
        Reflect.set(
          value,
          key,
          deserializeResponseDates(Reflect.get(value, key), child),
        )
    }
    if (plan.additional) {
      for (const key of Object.keys(value)) {
        if (!Object.prototype.hasOwnProperty.call(plan.properties, key))
          Reflect.set(
            value,
            key,
            deserializeResponseDates(Reflect.get(value, key), plan.additional),
          )
      }
    }
  }
  return value
}
