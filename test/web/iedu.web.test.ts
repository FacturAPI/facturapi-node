import { describe, expect, it } from 'vitest'

import { buildIeduComplement, IEDU_NAMESPACE } from '../../src'

describe('IEDU helpers (web simulation)', () => {
  it('builds IEDU XML in browser-like runtimes', () => {
    const xml = buildIeduComplement({
      nombreAlumno: 'JUAN PEREZ',
      CURP: 'PEGJ100515HDFRRN09',
      nivelEducativo: 'Primaria',
      autRVOE: 'ABC-123',
    })

    expect(xml).toContain('<iedu:instEducativas')
    expect(xml).toContain('CURP="PEGJ100515HDFRRN09"')
  })

  it('exports IEDU_NAMESPACE', () => {
    expect(IEDU_NAMESPACE.prefix).toBe('iedu')
    expect(IEDU_NAMESPACE.uri).toBe('http://www.sat.gob.mx/iedu')
  })
})
