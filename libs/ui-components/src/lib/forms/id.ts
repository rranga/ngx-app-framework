let nextId = 0;

/**
 * Creates a document-unique id for elements that the consumer did not name.
 * Ids are deterministic in creation order, which keeps server and client
 * renders consistent when components are created in the same order.
 */
export function uniqueId(prefix: string): string {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

/**
 * Merges space-separated id reference lists (as used by `aria-describedby`),
 * removing blanks and duplicates while preserving order.
 *
 * @returns the merged list, or `null` so the attribute is removed when empty.
 */
export function mergeIdRefs(
  ...lists: readonly (string | null | undefined)[]
): string | null {
  const ids = new Set<string>();

  for (const list of lists) {
    for (const id of list?.split(/\s+/) ?? []) {
      if (id) {
        ids.add(id);
      }
    }
  }

  return ids.size ? [...ids].join(' ') : null;
}
