function isInt(x){return Number.isFinite(x) && Math.abs(x - Math.round(x)) < 1e-9}

export const formulas = {
  // mode: 'both' | 'none' | 'one' | 'circle'
  computeTreeCount({L=0,d=1,mode='both'}){
    if(d<=0) return NaN;
    const ratio = L/d;
    switch(mode){
      case 'both': return isInt(ratio) ? ratio + 1 : NaN; // n = L/d + 1
      case 'none': return isInt(ratio) ? ratio - 1 : NaN; // n = L/d - 1
      case 'one': return isInt(ratio) ? ratio : NaN;      // n = L/d
      case 'circle': return isInt(ratio) ? ratio : NaN;   // n = C/d
      default: return NaN;
    }
  },
  // 给定 n 与 d 求 L 或 C
  lengthFrom({n=0,d=1,mode='both'}){
    if(d<=0||n<=0) return NaN;
    switch(mode){
      case 'both': return (n-1)*d;
      case 'none': return (n+1)*d;
      case 'one': return n*d;
      case 'circle': return n*d;
      default: return NaN;
    }
  }
};

// 生成沿线/环的树坐标，用于可视化
export function generatePositions({mode='both', n=5, length=40}){
  // 返回 0..1 的比例位置数组（线段）或角度数组（环形）
  if(n<=0) return [];
  if(mode === 'circle'){
    const arr = [];
    for(let i=0;i<n;i++) arr.push((i/n) * Math.PI*2);
    return arr; // angle radians
  } else {
    const gaps = (mode==='both')? n-1 : (mode==='none'? n+1 : n);
    if(gaps<=0) return [0];
    const step = 1/gaps;
    const arr = [];
    const start = (mode==='none' || mode==='one')? step : 0; // 首端是否空
    const end = (mode==='none')? 1-step : 1; // 末端是否空
    for(let t=start; t<=end+1e-9; t+=step) arr.push(Math.min(1,t));
    return arr;
  }
}

