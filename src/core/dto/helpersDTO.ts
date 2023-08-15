export interface AnimationProps {
  text: { previous: string, current: string },
  changed: boolean,
  animable: boolean,
  separator?: { decimal?: string, thousands?: string },
  presign?: { from: string, to: string }
  prefix?: { from: string, to: string }
  suffix?: { from: string, to: string }
  sign?: { from: string, to: string }
  value?: { from: number, to: number }
  decimals?: number,
  fractions?: number,
  pattern?: { separator?: string, exponent?: number }[]
}
