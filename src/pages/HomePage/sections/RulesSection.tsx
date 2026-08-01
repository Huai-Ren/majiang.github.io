import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RulesSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-card rounded-xl border border-border/60 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 bg-muted/50 border-b border-border/60 flex items-center justify-between hover:bg-muted/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold text-foreground text-sm">规则说明</span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 text-sm text-foreground/90 leading-relaxed">
              <div>
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-emerald-600 rounded-full" />
                  基础计分
                </h3>
                <ul className="space-y-1 text-muted-foreground pl-2">
                  <li>• 番数从 0 番起算，0 番 = 1 分</li>
                  <li>• 1 番 = 2 分，2 番 = 4 分，3 番 = 8 分，4 番 = 16 分，5 番 = 32 分</li>
                  <li>• 封顶 5 番（仅针对胡牌基础分数）</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-emerald-600 rounded-full" />
                  牌型番数
                </h3>
                <ul className="space-y-1 text-muted-foreground pl-2">
                  <li>• 平胡：0 番</li>
                  <li>• 大对子/碰碰胡：1 番</li>
                  <li>• 七对：2 番</li>
                  <li>• 金钩钓：2 番</li>
                  <li>• 龙七对：3 番</li>
                  <li>• 双龙七对：4 番</li>
                  <li>• 清一色：2 番</li>
                  <li>• 清一色大对子：3 番</li>
                  <li>• 清一色七对：4 番</li>
                  <li>• 清一色金钩钓：4 番</li>
                  <li>• 清一色龙七对：5 番（封顶）</li>
                  <li>• 清一色双龙七对：5 番（封顶）</li>
                  <li>• 每多一个根：番数 +1，受封顶限制</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-emerald-600 rounded-full" />
                  附加番（计入封顶）
                </h3>
                <ul className="space-y-1 text-muted-foreground pl-2">
                  <li>• 自摸：+1 番</li>
                  <li>• 无鸡（手牌无幺鸡）：+1 番</li>
                  <li>• 杠上花：+1 番</li>
                  <li>• 天胡：直接 5 番封顶</li>
                  <li>• 地胡：4 番</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-red-600 rounded-full" />
                  幺鸡吃喜（独立计分，不封顶）
                </h3>
                <ul className="space-y-1 text-muted-foreground pl-2">
                  <li>• 3 只幺鸡：每家 16 分，三家共 48 分</li>
                  <li>• 4 只幺鸡：每家 32 分，三家共 96 分</li>
                  <li>• 抢杠胡时，吃喜钱仍按实际幺鸡数量收</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-amber-700 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-amber-600 rounded-full" />
                  杠牌计分（独立，不封顶）
                </h3>
                <ul className="space-y-1 text-muted-foreground pl-2">
                  <li>• 点杠：点杠者单独付。有鸡 2 分，无鸡 4 分</li>
                  <li>• 巴杠：三家各付。有鸡每家 1 分，无鸡每家 2 分</li>
                  <li>• 暗杠：三家各付。有鸡每家 2 分，无鸡每家 4 分</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-emerald-600 rounded-full" />
                  胡牌总得分
                </h3>
                <ul className="space-y-1 text-muted-foreground pl-2">
                  <li>• 自摸：胡牌分数 × 3 + 吃喜钱 × 3 + 杠牌收入</li>
                  <li>• 点炮：放炮者付胡牌分数 + 吃喜钱三家各付 + 杠牌收入</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-red-600 rounded-full" />
                  特殊规则
                </h3>
                <ul className="space-y-1 text-muted-foreground pl-2">
                  <li>• 花猪：赔付 32 分给其他未花猪玩家</li>
                  <li>• 查叫：无叫玩家赔付听牌玩家理论胡牌分数</li>
                  <li>• 麻胡/诈胡：赔 32 分给每家</li>
                  <li>• 抢杠胡：被抢杠者承担放炮责任</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
