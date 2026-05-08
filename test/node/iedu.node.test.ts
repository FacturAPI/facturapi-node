import { describe, expect, it } from 'vitest'

import { buildIeduComplement, IEDU_NAMESPACE } from '../../src'

describe('buildIeduComplement', () => {
  it('serializes a typed iedu input into the SAT-shaped XML fragment', () => {
    const xml = buildIeduComplement({
      nombreAlumno: 'JUAN PEREZ GARCIA',
      CURP: 'PEGJ100515HDFRRN09',
      nivelEducativo: 'Primaria',
      autRVOE: 'ABC-123456',
    })

    expect(xml).toContain('<iedu:instEducativas')
    expect(xml).toContain('xmlns:iedu="http://www.sat.gob.mx/iedu"')
    expect(xml).toContain('version="1.0"')
    expect(xml).toContain('nombreAlumno="JUAN PEREZ GARCIA"')
    expect(xml).toContain('CURP="PEGJ100515HDFRRN09"')
    expect(xml).toContain('nivelEducativo="Primaria"')
    expect(xml).toContain('autRVOE="ABC-123456"')
    expect(xml).not.toContain('rfcPago')
    expect(xml).toMatch(/\/>$/)
  })

  it('includes rfcPago when provided', () => {
    const xml = buildIeduComplement({
      nombreAlumno: 'A',
      CURP: 'B',
      nivelEducativo: 'Bachillerato o su equivalente',
      autRVOE: 'C',
      rfcPago: 'PEGM800101AB1',
    })

    expect(xml).toContain('rfcPago="PEGM800101AB1"')
  })

  it('omits rfcPago when explicitly empty string', () => {
    const xml = buildIeduComplement({
      nombreAlumno: 'A',
      CURP: 'B',
      nivelEducativo: 'Primaria',
      autRVOE: 'C',
      rfcPago: '',
    })

    expect(xml).not.toContain('rfcPago')
  })

  it('escapes XML special characters in attribute values', () => {
    const xml = buildIeduComplement({
      nombreAlumno: 'O\'Brien & Sons "Ltd"',
      CURP: 'X',
      nivelEducativo: 'Primaria',
      autRVOE: 'Y<Z>',
    })

    expect(xml).toContain(
      'nombreAlumno="O&apos;Brien &amp; Sons &quot;Ltd&quot;"',
    )
    expect(xml).toContain('autRVOE="Y&lt;Z&gt;"')
  })

  it.each([
    [
      'nombreAlumno',
      {
        nombreAlumno: '',
        CURP: 'X',
        nivelEducativo: 'Primaria' as const,
        autRVOE: 'Y',
      },
    ],
    [
      'CURP',
      {
        nombreAlumno: 'A',
        CURP: '   ',
        nivelEducativo: 'Primaria' as const,
        autRVOE: 'Y',
      },
    ],
    [
      'nivelEducativo',
      {
        nombreAlumno: 'A',
        CURP: 'B',
        nivelEducativo: '' as never,
        autRVOE: 'Y',
      },
    ],
    [
      'autRVOE',
      {
        nombreAlumno: 'A',
        CURP: 'B',
        nivelEducativo: 'Primaria' as const,
        autRVOE: '',
      },
    ],
  ])(
    'throws when required field "%s" is missing or empty',
    (fieldName, input) => {
      expect(() => buildIeduComplement(input)).toThrow(new RegExp(fieldName))
    },
  )
})

describe('IEDU_NAMESPACE', () => {
  it('exposes the iedu prefix, uri and schema_location used by FacturAPI', () => {
    expect(IEDU_NAMESPACE).toEqual({
      prefix: 'iedu',
      uri: 'http://www.sat.gob.mx/iedu',
      schema_location: 'http://www.sat.gob.mx/sitio_interet/cfd/iedu/iedu.xsd',
    })
  })
})
