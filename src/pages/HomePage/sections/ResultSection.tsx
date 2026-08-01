import { Trophy, Users, Target, Sparkles, Bird, Flame, AlertTriangle } from 'lucide-react';
import type { CalcResult, WinMode } from '@/lib/mahjong-calc';
import { cn } from '@/lib/utils';

interface ResultSectionProps {
  result: CalcResult;
  winMode: WinMode;
}

export default function ResultSection({ result, winMode }: ResultSectionProps) {
  const {
    baseFan,
    addFan,
    finalFan,
    isCapped,
    huScore,
    chiXiPerPerson,
    chiXiTotal,
    gangScore,
    specialPenalty,
    specialDesc,
    zimoTotal,
    dianpaoTotal,
  } = result;

  // 根据胡牌方式显示主要得分
  const mainTotal = winMode === 'zimo' ? zimoTotal : dianpaoTotal;
  const mainLabel = winMode === 'zimo' ? '自摸总得分' : winMode === 'dianpao' ? '点炮得分' : '抢杠胡得分';

  return (
    <section className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 rounded-xl shadow-lg overflow-hidden text-white">
      {/* 顶部标题 */}
      <div className="px-4 py-3 border-b border-emerald-600/50 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-300" />
        <h2 className="font-bold text-lg">算分结果</h2>
        {isCapped && (
          <span className="ml-auto bg-yellow-400 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            已封顶
          </span>
        )}
      </div>

      {/* 总番数 */}
      <div className="px-4 py-5 text-center border-b border-emerald-600/30">
        <div className="text-sm text-emerald-200 mb-1">总番数</div>
        <div className="flex items-center justify-center gap-2">
          <span
            className={cn(
              'text-4xl md:text-5xl font-black tabular-nums tracking-tight',
              isCapped && 'text-yellow-300'
            )}
          >
            {finalFan}
          </span>
          <span className="text-xl font-bold text-emerald-200">番</span>
        </div>
        <div className="text-xs text-emerald-300 mt-1">
          基础 {baseFan}番 + 附加 {addFan}番
        </div>
      </div>

      {/* 主要得分展示 */}
      <div className="bg-emerald-900/60 px-4 py-4 border-b border-emerald-600/30">
        <div className="text-xs text-emerald-300 mb-1 text-center">{mainLabel}</div>
        <div className="text-center">
          <span className="text-3xl md:text-4xl font-black tabular-nums text-yellow-300">
            {mainTotal}
          </span>
          <span className="text-lg font-bold text-emerald-200 ml-1">分</span>
        </div>
      </div>

      {/* 得分明细 */}
      <div className="px-4 py-3 space-y-2.5 text-sm">
        {/* 胡牌分 */}
        <div className="flex justify-between items-center">
          <span className="text-emerald-200 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            胡牌分
          </span>
          <span className="font-semibold tabular-nums">
            {huScore} 分/家
          </span>
        </div>

        {/* 幺鸡吃喜 */}
        <div className="flex justify-between items-center">
          <span className="text-emerald-200 flex items-center gap-1.5">
            <Bird className="w-3.5 h-3.5" />
            幺鸡吃喜
          </span>
          <span className="font-semibold tabular-nums">
            {chiXiPerPerson > 0 ? `${chiXiPerPerson}分/家 · 共${chiXiTotal}分` : '无'}
          </span>
        </div>

        {/* 杠牌收入 */}
        <div className="flex justify-between items-center">
          <span className="text-emerald-200 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            杠牌收入
          </span>
          <span className="font-semibold tabular-nums">
            {gangScore.count > 0 ? `${gangScore.total}分（${gangScore.count}杠）` : '无'}
          </span>
        </div>
      </div>

      {/* 两种场景对比 */}
      <div className="bg-emerald-950/50 px-4 py-3 grid grid-cols-2 gap-3 border-t border-emerald-600/30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-emerald-300 mb-1">
            <Users className="w-3.5 h-3.5" />
            自摸（三家）
          </div>
          <div className="text-lg font-bold tabular-nums text-yellow-300">
            {zimoTotal} 分
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-emerald-300 mb-1">
            <Target className="w-3.5 h-3.5" />
            点炮（一家）
          </div>
          <div className="text-lg font-bold tabular-nums text-white">
            {dianpaoTotal} 分
          </div>
        </div>
      </div>

      {/* 特殊惩罚 */}
      {specialPenalty > 0 && (
        <div className="bg-red-900/60 px-4 py-3 border-t border-red-700/50">
          <div className="flex items-center gap-2 text-red-200 text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{specialDesc}</span>
          </div>
        </div>
      )}
    </section>
  );
}
