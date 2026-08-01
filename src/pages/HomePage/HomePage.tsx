import { useState, useEffect, useMemo } from 'react';
import { scopedStorage } from '@lark-apaas/client-toolkit-lite';
import { calculateScore, type CalcParams } from '@/lib/mahjong-calc';
import HeaderSection from './sections/HeaderSection';
import CalculatorSection from './sections/CalculatorSection';
import ResultSection from './sections/ResultSection';
import RulesSection from './sections/RulesSection';

const STORAGE_KEY = 'leshan_mahjong_settings_v2';

const DEFAULT_PARAMS: CalcParams = {
  handType: 'pinghu',
  genCount: 0,
  zimo: false,
  wuji: false,
  gangshanghua: false,
  tianhu: false,
  dihu: false,
  yaoJiCount: 0,
  winMode: 'zimo',
  gangRecords: [],
  huazhu: false,
  chajiao: false,
  mahu: false,
};

export default function HomePage() {
  const [params, setParams] = useState<CalcParams>(() => {
    try {
      const saved = scopedStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PARAMS, ...parsed };
      }
    } catch {
      // 忽略读取错误
    }
    return DEFAULT_PARAMS;
  });

  // 持久化用户偏好设置
  useEffect(() => {
    try {
      const toSave = {
        handType: params.handType,
        winMode: params.winMode,
      };
      scopedStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // 忽略写入错误
    }
  }, [params.handType, params.winMode]);

  const result = useMemo(() => calculateScore(params), [params]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-background to-amber-50/30">
      <HeaderSection />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* 结果展示区 - 放在上方方便查看 */}
        <ResultSection result={result} winMode={params.winMode} />

        {/* 算分参数区 */}
        <CalculatorSection params={params} onChange={setParams} />

        {/* 规则说明 */}
        <RulesSection />

        {/* 底部版权 */}
        <footer className="text-center text-xs text-muted-foreground py-4">
          <p>乐山幺鸡麻将算分器 · 纯前端离线使用</p>
          <p className="mt-1">🀄 仅供娱乐参考，实际以牌桌规则为准</p>
        </footer>
      </main>
    </div>
  );
}
