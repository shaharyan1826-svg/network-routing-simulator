const N = (id, label, type, x, y) => ({ id, label, type, x, y, status: 'up', ip: '', interface: '' });
const E = (id, source, target, cost, latency, bandwidth) => ({ id, source, target, cost, latency, bandwidth, status: 'up' });
export const samples = {
  'Small network': {
    nodes: [N('PC-A','PC-A','computer',90,240),N('R1','Router 1','router',285,110),N('R2','Router 2','router',285,370),N('R3','Router 3','router',510,230),N('S1','Web server','server',735,230),N('PC-B','PC-B','computer',510,430)],
    edges: [E('e1','PC-A','R1',4,8,100),E('e2','PC-A','R2',2,5,100),E('e3','R1','R2',1,2,1000),E('e4','R1','R3',5,10,100),E('e5','R2','R3',8,15,100),E('e6','R3','S1',2,4,1000),E('e7','R2','PC-B',3,6,100),E('e8','PC-B','S1',7,14,100)]
  },
  'Campus network': {
    nodes: [N('LAB','IT Lab','computer',90,125),N('LIB','Library PC','computer',90,360),N('GW','Gateway','router',290,245),N('WIFI','Wi-Fi router','router',480,390),N('CORE','Core router','router',500,200),N('WEB','Web server','server',740,105),N('DB','Database','server',740,315),N('ADMIN','Admin PC','computer',500,470)],
    edges: [E('c1','LAB','GW',2,3,1000),E('c2','LIB','GW',3,5,100),E('c3','GW','CORE',2,2,1000),E('c4','GW','WIFI',4,7,100),E('c5','WIFI','CORE',2,3,1000),E('c6','CORE','WEB',3,6,1000),E('c7','CORE','DB',1,2,1000),E('c8','WIFI','ADMIN',2,4,100),E('c9','ADMIN','DB',5,9,100),E('c10','WEB','DB',4,7,1000)]
  },
  'Resilient network': {
    nodes: [N('PC1','Workstation','computer',85,255),N('EDGE1','Edge router A','router',265,120),N('EDGE2','Edge router B','router',265,390),N('CORE1','Core router A','router',475,120),N('CORE2','Core router B','router',475,390),N('DIST','Distribution','router',645,255),N('APP','App server','server',800,145),N('DB','DB server','server',800,370)],
    edges: [E('r1','PC1','EDGE1',2,3,1000),E('r2','PC1','EDGE2',3,5,100),E('r3','EDGE1','CORE1',2,2,1000),E('r4','EDGE1','CORE2',7,12,100),E('r5','EDGE2','CORE1',6,10,100),E('r6','EDGE2','CORE2',2,3,1000),E('r7','CORE1','CORE2',2,2,1000),E('r8','CORE1','DIST',3,4,1000),E('r9','CORE2','DIST',2,3,1000),E('r10','DIST','APP',1,2,1000),E('r11','DIST','DB',2,3,1000),E('r12','APP','DB',3,6,1000)]
  }
};
export const cloneSample = name => JSON.parse(JSON.stringify(samples[name] || samples['Small network']));
