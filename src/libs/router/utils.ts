export function mapTree<T extends { children?: T[] }, R>(
  tree: T[],
  iteratee: (item: T, index: number, tree: T[]) => R,
): R[] {
  const result: R[] = []
  const walk = (item: T, index: number, tree: T[]) => {
    result.push(iteratee(item, index, tree))
    if (item.children) {
      item.children.forEach(walk)
    }
  }
  tree.forEach(walk)
  return result
}
