import type { XmlNamespace } from '../types/common';
import type { IeduComplementInput } from '../types/complements';

/**
 * IEDU XML namespace as accepted by FacturAPI when stamping CFDIs that include
 * the Instituciones Educativas complement. Pass it in the invoice's top-level
 * `namespaces` array alongside an item-level `complement` built with
 * {@link buildIeduComplement}.
 */
export const IEDU_NAMESPACE: XmlNamespace = {
  prefix: 'iedu',
  uri: 'http://www.sat.gob.mx/iedu',
  schema_location: 'http://www.sat.gob.mx/sitio_interet/cfd/iedu/iedu.xsd',
};

const IEDU_VERSION = '1.0';

function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function assertNonEmpty(
  value: string | undefined,
  fieldName: string,
): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `IEDU complement: required field "${fieldName}" is missing or empty.`,
    );
  }
}

/**
 * Serializes an {@link IeduComplementInput} into the SAT-required XML fragment
 * that goes into the per-line-item `complement` field of an invoice. Pair it
 * with {@link IEDU_NAMESPACE} on the invoice's top-level `namespaces` array.
 *
 * @throws Error if any required field is missing or empty.
 */
export function buildIeduComplement(input: IeduComplementInput): string {
  assertNonEmpty(input.nombreAlumno, 'nombreAlumno');
  assertNonEmpty(input.CURP, 'CURP');
  assertNonEmpty(input.nivelEducativo, 'nivelEducativo');
  assertNonEmpty(input.autRVOE, 'autRVOE');

  const attrs: string[] = [
    `version="${IEDU_VERSION}"`,
    `nombreAlumno="${escapeXmlAttribute(input.nombreAlumno)}"`,
    `CURP="${escapeXmlAttribute(input.CURP)}"`,
    `nivelEducativo="${escapeXmlAttribute(input.nivelEducativo)}"`,
    `autRVOE="${escapeXmlAttribute(input.autRVOE)}"`,
  ];
  if (input.rfcPago !== undefined && input.rfcPago !== '') {
    attrs.push(`rfcPago="${escapeXmlAttribute(input.rfcPago)}"`);
  }

  return `<iedu:instEducativas xmlns:iedu="${IEDU_NAMESPACE.uri}" ${attrs.join(' ')}/>`;
}
