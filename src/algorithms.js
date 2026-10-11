export const edgeWeight = (edge, metric = 'cost') => Number(edge[metric] ?? edge.weight ?? 1);
export const isEdgeUp = edge => edge.status !== 'down';
export const isNodeUp = node => node.status !== 'down';

export function adjacency(nodes, edges, metric = 'cost') {
  const activeNodes = new Set(nodes.filter(isNodeUp).map(n => n.id));
  const graph = new Map([...activeNodes].map(id => [id, []]));
  for (const e of edges) {
    if (!isEdgeUp(e) || !activeNodes.has(e.source) || !activeNodes.has(e.target)) continue;
    const w = edgeWeight(e, metric);
    graph.get(e.source).push({ to: e.target, weight: w, edgeId: e.id, edge: e });
    graph.get(e.target).push({ to: e.source, weight: w, edgeId: e.id, edge: e });
  }
  for (const list of graph.values()) list.sort((a, b) => a.to.localeCompare(b.to));
  return graph;
}

function reconstructPath(prev, source, target) {
  if (source === target) return [source];
  if (!prev.has(target)) return [];
  const path = []; let current = target;
  for (let guard = 0; current != null && guard < prev.size + 2; guard++) {
    path.unshift(current);
    if (current === source) return path;
    current = prev.get(current);
  }
  return [];
}

function resultBase(name, source, target) {
  return { algorithm: name, source, target, path: [], cost: Infinity, hops: Infinity, distances: {}, predecessors: {}, visited: [], steps: [], error: '', complexity: '' };
}

export function dijkstra(nodes, edges, source, target, metric = 'cost') {
  const out = resultBase('Dijkstra', source, target), graph = adjacency(nodes, edges, metric);
  if (!graph.has(source) || !graph.has(target)) return { ...out, error: 'The source or destination is unavailable. Check that the device is enabled.' };
  if (edges.some(e => isEdgeUp(e) && edgeWeight(e, metric) < 0)) return { ...out, error: 'Dijkstra requires non-negative active link weights.' };
  const dist = new Map([...graph.keys()].map(id => [id, Infinity])), prev = new Map(), settled = new Set(), steps = [];
  dist.set(source, 0);
  // Small in-app networks use a simple priority selection; this is easy to explain in a viva.
  while (true) {
    let u = null, best = Infinity;
    for (const [id, d] of dist) if (!settled.has(id) && d < best) { u = id; best = d; }
    if (u == null) break;
    settled.add(u);
    steps.push({ type: 'visit', current: u, distances: Object.fromEntries(dist), visited: [...settled], message: `Select ${u}, the unsettled node with the smallest known distance (${best}).` });
    if (u === target) break;
    for (const e of graph.get(u)) {
      if (settled.has(e.to)) continue;
      const candidate = dist.get(u) + e.weight, relaxed = candidate < dist.get(e.to);
      if (relaxed) { dist.set(e.to, candidate); prev.set(e.to, u); }
      steps.push({ type: 'relax', current: u, examining: e.to, edgeId: e.edgeId, relaxed, distances: Object.fromEntries(dist), visited: [...settled], predecessors: Object.fromEntries(prev), message: `${u} → ${e.to}: ${dist.get(u)} + ${e.weight} = ${candidate}. ${relaxed ? 'Update the best distance.' : 'Keep the existing distance.'}` });
    }
  }
  const path = reconstructPath(prev, source, target);
  return { ...out, path, cost: path.length ? dist.get(target) : Infinity, hops: path.length ? path.length - 1 : Infinity, distances: Object.fromEntries(dist), predecessors: Object.fromEntries(prev), visited: [...settled], steps, error: path.length ? '' : 'No route exists between these devices.', complexity: 'O(V² + E)' };
}

export function bellmanFord(nodes, edges, source, target, metric = 'cost') {
  const out = resultBase('Bellman–Ford', source, target), graph = adjacency(nodes, edges, metric);
  if (!graph.has(source) || !graph.has(target)) return { ...out, error: 'The source or destination is unavailable.' };
  const dist = new Map([...graph.keys()].map(id => [id, Infinity])), prev = new Map(), steps = [];
  dist.set(source, 0);
  const arcs = [];
  for (const [u, list] of graph) for (const e of list) arcs.push({ from: u, to: e.to, weight: e.weight, edgeId: e.edgeId });
  for (let pass = 1; pass < graph.size; pass++) {
    let changed = false;
    for (const a of arcs) {
      if (dist.get(a.from) === Infinity) continue;
      const candidate = dist.get(a.from) + a.weight, relaxed = candidate < dist.get(a.to);
      if (relaxed) { dist.set(a.to, candidate); prev.set(a.to, a.from); changed = true; }
      steps.push({ type: 'relax', current: a.from, examining: a.to, edgeId: a.edgeId, relaxed, pass, distances: Object.fromEntries(dist), predecessors: Object.fromEntries(prev), visited: [...new Set(steps.map(s => s.current).filter(Boolean))], message: `Pass ${pass}: check ${a.from} → ${a.to}. ${relaxed ? 'Distance improved.' : 'No update.'}` });
    }
    if (!changed) break;
  }
  if (arcs.some(a => dist.get(a.from) !== Infinity && dist.get(a.from) + a.weight < dist.get(a.to))) return { ...out, error: 'A reachable negative-weight cycle exists; no finite shortest path can be reported.', negativeCycle: true, distances: Object.fromEntries(dist), steps, complexity: 'O(VE)' };
  const path = reconstructPath(prev, source, target);
  return { ...out, path, cost: path.length ? dist.get(target) : Infinity, hops: path.length ? path.length - 1 : Infinity, distances: Object.fromEntries(dist), predecessors: Object.fromEntries(prev), visited: [...new Set(steps.map(s => s.current).filter(Boolean))], steps, error: path.length ? '' : 'No route exists between these devices.', complexity: 'O(VE)' };
}

export function bfs(nodes, edges, source, target) {
  const out = resultBase('BFS', source, target), graph = adjacency(nodes, edges, 'cost');
  if (!graph.has(source) || !graph.has(target)) return { ...out, error: 'The source or destination is unavailable.' };
  const queue = [source], seen = new Set([source]), prev = new Map(), hops = new Map([[source, 0]]), steps = [];
  while (queue.length) {
    const u = queue.shift();
    steps.push({ type: 'visit', current: u, visited: [...seen], distances: Object.fromEntries(hops), message: `Dequeue ${u}; explore its neighbours.` });
    if (u === target) break;
    for (const e of graph.get(u)) if (!seen.has(e.to)) {
      seen.add(e.to); prev.set(e.to, u); hops.set(e.to, hops.get(u) + 1); queue.push(e.to);
      steps.push({ type: 'discover', current: u, examining: e.to, edgeId: e.edgeId, visited: [...seen], distances: Object.fromEntries(hops), predecessors: Object.fromEntries(prev), message: `Discover ${e.to} at ${hops.get(e.to)} hop(s).` });
    }
  }
  const path = reconstructPath(prev, source, target), graphCost = adjacency(nodes, edges, 'cost');
  let cost = 0;
  for (let i = 1; i < path.length; i++) cost += graphCost.get(path[i - 1])?.find(e => e.to === path[i])?.weight ?? 0;
  return { ...out, path, cost: path.length ? cost : Infinity, hops: path.length ? path.length - 1 : Infinity, distances: Object.fromEntries(hops), predecessors: Object.fromEntries(prev), visited: [...seen], steps, error: path.length ? '' : 'No route exists between these devices.', complexity: 'O(V + E)', note: 'BFS minimizes hops, not weighted cost.' };
}

export function runAlgorithm(name, nodes, edges, source, target, metric = 'cost') {
  const start = performance.now();
  const result = name === 'Bellman–Ford' ? bellmanFord(nodes, edges, source, target, metric) : name === 'BFS' ? bfs(nodes, edges, source, target) : dijkstra(nodes, edges, source, target, metric);
  return { ...result, runtimeMs: performance.now() - start };
}

export function allRoutesFrom(nodes, edges, source, metric = 'cost') {
  const graph = adjacency(nodes, edges, metric);
  if (!graph.has(source)) return [];
  return nodes.map(n => {
    const r = dijkstra(nodes, edges, source, n.id, metric), path = r.path;
    return { destination: n.id, nextHop: path.length > 1 ? path[1] : path.length === 1 ? 'Local' : '—', cost: r.cost, hops: r.hops, path, status: path.length ? 'Reachable' : 'Unreachable' };
  });
}
