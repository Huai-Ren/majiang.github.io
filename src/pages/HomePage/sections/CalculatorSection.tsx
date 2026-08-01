import { useState } from 'react';
import {
  Layers,
  PlusCircle,
  Bird,
  Minus,
  Plus,
  Trophy,
  Flame,
  Trash2,
} from 'lucide-react';
import {
  HAND_TYPE_LABELS,
  HAND_TYPE_FAN,
  type HandType,
  type CalcParams,
  type GangRecord,
  type GangType,
  type WinMode,
} from '@/lib/mahjong-calc';
import { cn } from '@/lib/utils';

interface CalculatorSectionProps {
  params: CalcParams;
  onChange: (params: CalcParams) => void;
}

const HAND_TYPES: HandType[] = [
  'pinghu',
  'dadui',
  'qidui',
  'jingoudiao',
  'longqidui',
  'shuanglongqidui',
  'qingyise',
  'qingyise_dadui',
  'qingyise_qidui',
  'qingyise_jgd',
  'qingyise_lqd',
  'qingyise_slqd',
];

const GANG_TYPE_LABELS: Record<GangType, string> = {
  diangang: '点杠',
  bagang: '巴杠',
  angang: '暗杠',
};

const GANG_TYPE_SCORE: Record<GangType, { hasJi: number; noJi: number }> = {
  diangang: { hasJi: 2, noJi: 4 },
  bagang: { hasJi: 1, noJi: 2 },
  angang: { hasJi: 2, noJi: 4 },
};

export default function CalculatorSection({
  params,
  onChange,
}: CalculatorSectionProps) {
  const update = <K extends keyof CalcParams>(key: K, value: CalcParams[K]) => {
    onChange({ ...params, [key]: value });
  };

  const [newGangType, setNewGangType] = useState<GangType>('diangang');
  const [newGangHasJi, setNewGangHasJi] = useState(true);

  const addGang = () => {
    const newRecord: GangRecord = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      type: newGangType,
      hasJi: newGangHasJi,
    };
    update('gangRecords', [...params.gangRecords, newRecord]);
  };

  const removeGang = (id: string) => {
    update('gangRecords', params.gangRecords.filter((g) => g.id !== id));
  };

  // 数字步进器
  const Stepper = ({
    value,
    onChange: onStepperChange,
    min = 0,
    max = 4,
    label,
    unit = '个',
  }: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
    label: string;
    unit?: string;
  }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onStepperChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label={`减少${label}`}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-semibold text-foreground tabular-nums">
          {value}
          <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
        </span>
        <button
          type="button"
          onClick={() => onStepperChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label={`增加${label}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* 牌型选择区 */}
      <section className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted/50 border-b border-border/60 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <h2 className="font-semibold text-foreground text-sm">牌型选择</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {HAND_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => update('handType', type)}
                className={cn(
                  'py-2.5 px-1.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5',
                  params.handType === type
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <span>{HAND_TYPE_LABELS[type]}</span>
                <span
                  className={cn(
                    'text-[10px]',
                    params.handType === type
                      ? 'text-emerald-100'
                      : 'text-muted-foreground/70'
                  )}
                >
                  {HAND_TYPE_FAN[type]}番
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 附加番选项区 */}
      <section className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted/50 border-b border-border/60 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-emerald-700" />
          <h2 className="font-semibold text-foreground text-sm">附加番（计入5番封顶）</h2>
        </div>
        <div className="p-4 space-y-3">
          {/* 开关类附加番 */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'zimo', label: '自摸', desc: '+1番' },
              { key: 'wuji', label: '无鸡', desc: '+1番' },
              { key: 'gangshanghua', label: '杠上花', desc: '+1番' },
              { key: 'tianhu', label: '天胡', desc: '5番封顶' },
              { key: 'dihu', label: '地胡', desc: '4番' },
            ].map((item) => {
              const active = params[item.key as keyof CalcParams] as boolean;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    update(
                      item.key as keyof CalcParams,
                      !active as CalcParams[keyof CalcParams]
                    )
                  }
                  className={cn(
                    'py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between',
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      'text-xs',
                      active ? 'text-emerald-100' : 'text-muted-foreground/70'
                    )}
                  >
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 根数量 */}
          <div className="pt-2 border-t border-border/50">
            <Stepper
              label="根的数量（四张相同）"
              value={params.genCount}
              onChange={(v) => update('genCount', v)}
              min={0}
              max={4}
              unit="根"
            />
          </div>
        </div>
      </section>

      {/* 幺鸡设置区 */}
      <section className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-border/60 flex items-center gap-2">
          <Bird className="w-4 h-4 text-red-600" />
          <h2 className="font-semibold text-foreground text-sm">幺鸡吃喜（独立计分，不封顶）</h2>
        </div>
        <div className="p-4 space-y-4">
          <Stepper
            label="手中幺鸡数量"
            value={params.yaoJiCount}
            onChange={(v) => update('yaoJiCount', v)}
            min={0}
            max={4}
            unit="只"
          />

          {/* 吃喜说明 */}
          <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1.5 leading-relaxed">
            <p>
              <span className="font-medium text-emerald-700">3只鸡：</span>
              每家 16 分，三家共 48 分
            </p>
            <p>
              <span className="font-medium text-emerald-700">4只鸡：</span>
              每家 32 分，三家共 96 分
            </p>
            {params.yaoJiCount >= 3 && (
              <p className="pt-1.5 border-t border-border/50 font-medium text-amber-600">
                🏆 {params.yaoJiCount >= 4 ? '豪金（4只鸡）' : '精品（3只鸡）'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 胡牌方式 */}
      <section className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted/50 border-b border-border/60 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-emerald-700" />
          <h2 className="font-semibold text-foreground text-sm">胡牌方式</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'zimo' as WinMode, label: '自摸' },
              { key: 'dianpao' as WinMode, label: '点炮' },
              { key: 'qianggang' as WinMode, label: '抢杠胡' },
            ]).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => update('winMode', item.key)}
                className={cn(
                  'py-2.5 rounded-lg text-sm font-medium transition-all',
                  params.winMode === item.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          {params.winMode === 'qianggang' && (
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-md p-2">
              抢杠胡：被抢杠者承担放炮责任，按点炮计算胡牌分；吃喜钱仍按三家各付。
            </p>
          )}
        </div>
      </section>

      {/* 杠牌记录区 */}
      <section className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted/50 border-b border-border/60 flex items-center gap-2">
          <Flame className="w-4 h-4 text-emerald-700" />
          <h2 className="font-semibold text-foreground text-sm">杠牌记录（独立计分，不封顶）</h2>
        </div>
        <div className="p-4 space-y-3">
          {/* 添加杠 */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1">
              {(['diangang', 'bagang', 'angang'] as GangType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewGangType(t)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    newGangType === t
                      ? 'bg-emerald-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {GANG_TYPE_LABELS[t]}
                </button>
              ))}
            </div>
            <div className="flex gap-1 ml-auto">
              <button
                type="button"
                onClick={() => setNewGangHasJi(true)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  newGangHasJi
                    ? 'bg-red-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                有鸡
              </button>
              <button
                type="button"
                onClick={() => setNewGangHasJi(false)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  !newGangHasJi
                    ? 'bg-slate-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                无鸡
              </button>
            </div>
            <button
              type="button"
              onClick={addGang}
              className="w-full sm:w-auto px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-all flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              添加一杠
            </button>
          </div>

          {/* 杠牌列表 */}
          {params.gangRecords.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-4 bg-muted/30 rounded-lg">
              暂无杠牌记录
            </div>
          ) : (
            <div className="space-y-2">
              {params.gangRecords.map((g, idx) => {
                const score = GANG_TYPE_SCORE[g.type];
                const perPerson = g.type === 'diangang' ? score.hasJi : (g.hasJi ? score.hasJi : score.noJi);
                const total = g.type === 'diangang'
                  ? (g.hasJi ? score.hasJi : score.noJi)
                  : (g.hasJi ? score.hasJi : score.noJi) * 3;
                return (
                  <div
                    key={g.id}
                    className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                      <span className="text-sm font-medium text-foreground">
                        {GANG_TYPE_LABELS[g.type]}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          g.hasJi
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-200 text-slate-700'
                        )}
                      >
                        {g.hasJi ? '有鸡' : '无鸡'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-emerald-700 tabular-nums">
                        +{total}分
                        <span className="text-xs text-muted-foreground font-normal ml-1">
                          ({g.type === 'diangang' ? '点杠者付' : `${perPerson}分/家`})
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGang(g.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label="删除杠牌"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 特殊规则区 */}
      <section className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-red-50 border-b border-border/60 flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-600" />
          <h2 className="font-semibold text-foreground text-sm">特殊规则</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'huazhu', label: '花猪', desc: '赔32分/家' },
              { key: 'chajiao', label: '查叫', desc: '无叫赔听牌' },
              { key: 'mahu', label: '麻胡', desc: '赔32分/家' },
            ].map((item) => {
              const active = params[item.key as keyof CalcParams] as boolean;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    update(
                      item.key as keyof CalcParams,
                      !active as CalcParams[keyof CalcParams]
                    )
                  }
                  className={cn(
                    'py-2.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-0.5',
                    active
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      'text-[10px]',
                      active ? 'text-red-100' : 'text-muted-foreground/70'
                    )}
                  >
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
