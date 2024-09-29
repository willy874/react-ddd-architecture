export function mapTree<T extends { children?: T[] }, R>(
  tree: T[],
  iteratee: (item: T, index: number, tree: T[]) => R | R[] | void,
): R[] {
  const result: R[] = []
  const walk = (item: T, index: number, tree: T[]) => {
    const res = iteratee(item, index, tree)
    if (res) {
      if (Array.isArray(res)) {
        result.push(...res)
      } else {
        result.push(res)
      }
    }
    if (item.children) {
      return mapTree(item.children, iteratee)
    }
  }
  tree.forEach(walk)
  return result
}
