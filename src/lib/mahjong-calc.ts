// EXPORTS: HandType, GangRecord, CalcParams, CalcResult, HAND_TYPE_FAN, HAND_TYPE_LABELS, calculateScore

export type HandType =
  | 'pinghu'          // 平胡
  | 'dadui'           // 大对子/碰碰胡
  | 'qidui'           // 七对
  | 'jingoudiao'      // 金钩钓
  | 'longqidui'       // 龙七对
  | 'shuanglongqidui' // 双龙七对
  | 'qingyise'        // 清一色
  | 'qingyise_dadui'  // 清一色大对子
  | 'qingyise_qidui'  // 清一色七对
  | 'qingyise_jgd'    // 清一色金钩钓
  | 'qingyise_lqd'    // 清一色龙七对
  | 'qingyise_slqd';  // 清一色双龙七对

export type GangType = 'diangang' | 'bagang' | 'angang'; // 点杠/巴杠/暗杠

export interface GangRecord {
  id: string;
  type: GangType;
  hasJi: boolean; // 有鸡/无鸡
}

export type WinMode = 'zimo' | 'dianpao' | 'qianggang'; // 自摸/点炮/抢杠胡

export interface CalcParams {
  handType: HandType;
  genCount: number; // 根的数量 0-4
  zimo: boolean;
  wuji: boolean; // 无鸡
  gangshanghua: boolean;
  tianhu: boolean;
  dihu: boolean;
  yaoJiCount: number; // 0-4
  winMode: WinMode;
  gangRecords: GangRecord[];
  // 特殊规则
  huazhu: boolean; // 花猪
  chajiao: boolean; // 查叫
  mahu: boolean; // 麻胡/诈胡
}

export interface GangScore {
  perPerson: number; // 每家应付分数
  total: number; // 杠牌总收入
  count: number; // 杠的数量
}

export interface CalcResult {
  baseFan: number; // 基础牌型番数
  addFan: number; // 附加番合计（含根）
  totalFan: number; // 总番数（封顶前）
  finalFan: number; // 最终番数（封顶后）
  isCapped: boolean; // 是否封顶
  huScore: number; // 胡牌基础分（单家）
  // 幺鸡吃喜
  chiXiPerPerson: number; // 吃喜钱每家
  chiXiTotal: number; // 吃喜钱三家合计
  // 杠牌
  gangScore: GangScore;
  // 特殊惩罚
  specialPenalty: number; // 特殊惩罚总分（花猪/麻胡等）
  specialDesc: string; // 特殊惩罚说明
  // 总得分
  zimoTotal: number; // 自摸总得分
  dianpaoTotal: number; // 点炮总得分（放炮者付的部分）
  // 明细描述
  breakdown: string[];
}

export const HAND_TYPE_FAN: Record<HandType, number> = {
  pinghu: 0,
  dadui: 1,
  qidui: 2,
  jingoudiao: 2,
  longqidui: 3,
  shuanglongqidui: 4,
  qingyise: 2,
  qingyise_dadui: 3,
  qingyise_qidui: 4,
  qingyise_jgd: 4,
  qingyise_lqd: 5,
  qingyise_slqd: 5,
};

export const HAND_TYPE_LABELS: Record<HandType, string> = {
  pinghu: '平胡',
  dadui: '大对子',
  qidui: '七对',
  jingoudiao: '金钩钓',
  longqidui: '龙七对',
  shuanglongqidui: '双龙七对',
  qingyise: '清一色',
  qingyise_dadui: '清一色大对',
  qingyise_qidui: '清一色七对',
  qingyise_jgd: '清一色金钩钓',
  qingyise_lqd: '清一色龙七对',
  qingyise_slqd: '清一色双龙七对',
};

const MAX_FAN = 5;

// 计算杠牌收入
function calcGangScore(records: GangRecord[]): GangScore {
  let total = 0;
  for (const g of records) {
    if (g.type === 'diangang') {
      // 点杠：点杠者单独付，有鸡2分，无鸡4分
      total += g.hasJi ? 2 : 4;
    } else if (g.type === 'bagang') {
      // 巴杠：三家各付，有鸡每家1分，无鸡每家2分
      total += (g.hasJi ? 1 : 2) * 3;
    } else {
      // 暗杠：三家各付，有鸡每家2分，无鸡每家4分
      total += (g.hasJi ? 2 : 4) * 3;
    }
  }
  // 计算平均每家（仅用于展示参考）
  const perPerson = records.length > 0 ? Math.floor(total / 3) : 0;
  return { perPerson, total, count: records.length };
}

// 计算幺鸡吃喜
function calcChiXi(yaoJiCount: number): { perPerson: number; total: number } {
  let perPerson = 0;
  if (yaoJiCount >= 4) {
    perPerson = 32; // 4只鸡每家32分
  } else if (yaoJiCount >= 3) {
    perPerson = 16; // 3只鸡每家16分
  }
  return { perPerson, total: perPerson * 3 };
}

export function calculateScore(params: CalcParams): CalcResult {
  const {
    handType,
    genCount,
    zimo,
    wuji,
    gangshanghua,
    tianhu,
    dihu,
    yaoJiCount,
    winMode,
    gangRecords,
    huazhu,
    chajiao,
    mahu,
  } = params;

  const breakdown: string[] = [];

  // 1. 基础牌型番数
  let baseFan = HAND_TYPE_FAN[handType];
  breakdown.push(`牌型：${HAND_TYPE_LABELS[handType]}（${baseFan}番）`);

  // 2. 天胡/地胡直接设定番数（优先级最高）
  if (tianhu) {
    baseFan = MAX_FAN;
    breakdown.push('天胡：直接5番封顶');
  } else if (dihu) {
    baseFan = 4;
    breakdown.push('地胡：4番');
  }

  // 3. 附加番
  let addFan = 0;
  const addFanItems: string[] = [];
  if (zimo && !tianhu && !dihu) { addFan += 1; addFanItems.push('自摸+1'); }
  if (wuji && !tianhu && !dihu) { addFan += 1; addFanItems.push('无鸡+1'); }
  if (gangshanghua && !tianhu && !dihu) { addFan += 1; addFanItems.push('杠上花+1'); }
  // 根：每根+1
  const genFan = Math.max(0, Math.min(4, genCount));
  if (genFan > 0 && !tianhu && !dihu) {
    addFan += genFan;
    addFanItems.push(`${genFan}根+${genFan}`);
  }
  if (addFanItems.length > 0) {
    breakdown.push(`附加番：${addFanItems.join('、')}（共+${addFan}番）`);
  }

  // 4. 总番数
  const totalFan = baseFan + addFan;
  const isCapped = totalFan > MAX_FAN;
  const finalFan = isCapped ? MAX_FAN : totalFan;
  if (isCapped) {
    breakdown.push(`总番数：${totalFan}番 → ${MAX_FAN}番（已封顶）`);
  } else {
    breakdown.push(`总番数：${finalFan}番`);
  }

  // 5. 胡牌基础分（单家）= 2^finalFan
  const huScore = Math.pow(2, finalFan);
  breakdown.push(`胡牌分：${huScore}分/家（2^${finalFan}）`);

  // 6. 幺鸡吃喜
  const chiXi = calcChiXi(yaoJiCount);
  if (chiXi.perPerson > 0) {
    breakdown.push(`幺鸡吃喜：${chiXi.perPerson}分/家，三家共${chiXi.total}分（${yaoJiCount}只鸡）`);
  }

  // 7. 杠牌收入
  const gangScore = calcGangScore(gangRecords);
  if (gangScore.count > 0) {
    breakdown.push(`杠牌收入：共${gangScore.total}分（${gangScore.count}杠）`);
  }

  // 8. 特殊惩罚
  let specialPenalty = 0;
  let specialDesc = '';
  if (mahu) {
    specialPenalty = 32 * 3; // 麻胡赔每家32分
    specialDesc = '麻胡/诈胡：赔每家32分，共96分';
    breakdown.push(specialDesc);
  } else if (huazhu) {
    specialPenalty = 32 * 3; // 花猪赔每家32分
    specialDesc = '花猪：赔每家32分，共96分';
    breakdown.push(specialDesc);
  } else if (chajiao) {
    specialDesc = '查叫：无叫玩家赔付听牌玩家理论胡牌分数';
    breakdown.push(specialDesc);
  }

  // 9. 总得分
  // 自摸：胡牌分数×3 + 吃喜钱×3 + 杠牌收入
  const zimoTotal = huScore * 3 + chiXi.total + gangScore.total;
  // 点炮：放炮者付胡牌分数 + 吃喜钱三家各付 + 杠牌收入
  // 注意：吃喜钱三家各付，所以是 chiXi.total；杠牌收入也是三家的
  const dianpaoTotal = huScore + chiXi.total + gangScore.total;

  return {
    baseFan,
    addFan,
    totalFan,
    finalFan,
    isCapped,
    huScore,
    chiXiPerPerson: chiXi.perPerson,
    chiXiTotal: chiXi.total,
    gangScore,
    specialPenalty,
    specialDesc,
    zimoTotal,
    dianpaoTotal,
    breakdown,
  };
}
