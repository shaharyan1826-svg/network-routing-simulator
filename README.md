# NetRoute — Network Routing Simulator (AAD)

An educational, browser-based network simulation laboratory built with React and Vite. It demonstrates graph algorithms and practical routing concepts using a simulated topology. It does **not** connect to physical routers, run real OSPF, or send real network packets.


## 🌐 Live Demo

Try the Network Routing Simulator here:

[**Open NetRoute — Network Routing Simulator**](https://network-routing-simulator-xi.vercel.app/)

## 💻 Source Code

[View this project on GitHub](https://github.com/shaharyan1826-svg/network-routing-simulator)


## Features

- Responsive dark UI designed for desktop and laptop demonstrations, with mobile-friendly navigation.
- Interactive topology canvas with draggable devices and selectable links.
- Sample networks: Small network, Campus network, and Resilient network.
- Device types: computers, routers, switches, and servers.
- Add/remove devices and links; edit routing cost, latency, and bandwidth.
- Disable/restore links and devices; algorithms automatically exclude unavailable network elements.
- Dijkstra, Bellman–Ford, and BFS with route path, metrics, visited nodes, execution traces, and complexity notes.
- Routing tables with destination, next hop, metric, hop count, and reachability.
- OSPF-inspired link-state workflow: conceptual link-state sharing and shortest-path-first (Dijkstra) route derivation.
- Packet-hop animation with estimated link latency and per-hop details.
- Generated-graph performance lab with five trials per algorithm, median runtime, visited nodes, and route metrics.
- LocalStorage persistence and topology JSON import/export.
- Project guide and viva question/answer reference.

## Requirements

- Node.js LTS (includes npm)
- A modern browser (Chrome, Edge, Firefox, Safari)

## Run locally

1. Extract the ZIP file.
2. Open the `network-routing-simulator` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Check Node.js and npm:

   ```bash
   node -v
   npm -v
   ```

5. Install dependencies:

   ```bash
   npm install
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open the local URL printed by Vite (usually `http://localhost:5173`). Keep the terminal running while using the website. Press `Ctrl+C` to stop it.

## Algorithm smoke tests

The included lightweight test script checks a known Dijkstra result, BFS hop count, rerouting after a link failure, and route-table reachability. Run it with Node.js:

```bash
node scripts/smoke-test.mjs
```

## Production build

```bash
npm run build
npm run preview
```

Vite writes the production bundle to `dist/`.

## Suggested professor demo

1. Open **Topology editor** and choose `Resilient network`.
2. Select a link and explain routing cost, latency, and bandwidth.
3. Disable a link, then use **Route lab** to recalculate the route. Restore the link afterward.
4. Compare Dijkstra with BFS and explain the difference between minimum total cost and minimum hops.
5. Open **Routing tables** to explain next-hop forwarding.
6. Open **Link-state lab** and run the OSPF-inspired model. Explain that it is a teaching abstraction, not a full OSPF protocol implementation.
7. Open **Packet simulator** to demonstrate hop-by-hop forwarding.
8. Open **Performance lab** to run five trials on a generated graph. Explain that small timing differences are noisy and are not statistically conclusive.

## Algorithm notes

- **Dijkstra**: the implementation uses a simple unsettled-node selection scan. Time complexity is `O(V² + E)`. It requires non-negative weights.
- **Bellman–Ford**: repeatedly relaxes arcs derived from active undirected links and checks for reachable negative cycles. Time complexity is `O(VE)`. Negative weights are not exposed in the editor; an undirected negative-weight edge would create a negative cycle by traversing it in both directions.
- **BFS**: minimizes hop count, not weighted cost. Time complexity is `O(V + E)`.
- **Link-state lab**: demonstrates the high-level workflow of learning a topology and running shortest-path-first calculations. It does not implement OSPF packet formats, neighbor state machines, areas, timers, or real router communications.
- **Packet simulator**: animates a path and sums configured per-link latency values. It does not model queuing, congestion, packet loss statistically, or actual network traffic.
- **Performance lab**: uses deterministic generated graphs and five local trials. Runtime depends on the browser, computer, and current load; compare complexity and visited-node behavior as well as timings.

## Files

- `src/App.jsx` — UI, topology editor, simulation controls, route tables, packet animation, benchmarks.
- `src/algorithms.js` — graph representation and algorithm implementations.
- `src/samples.js` — editable example topologies.
- `src/styles.css` — responsive visual design.
- `src/main.jsx` — React entry point.
- `index.html` — page shell and metadata.

## Data and privacy

Topology state is stored in this browser's `localStorage`. It is not uploaded to a server. Use the Export JSON / Import JSON controls to move a topology between browsers or computers.
