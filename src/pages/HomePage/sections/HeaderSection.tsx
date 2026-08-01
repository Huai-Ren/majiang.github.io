import { Sparkles } from 'lucide-react';

export default function HeaderSection() {
  return (
    <header className="w-full bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white py-10 md:py-14 relative overflow-hidden">
      {/* 装饰性麻将图案背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 text-6xl font-bold">🀇</div>
        <div className="absolute top-10 right-8 text-5xl font-bold">🀙</div>
        <div className="absolute bottom-4 left-1/4 text-5xl font-bold">🀐</div>
        <div className="absolute bottom-8 right-1/3 text-6xl font-bold">🀄</div>
        <div className="absolute top-1/3 left-1/2 text-4xl font-bold">🀅</div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-3xl md:text-4xl">🀄</span>
          <h1 className="text-2xl md:text-4xl font-bold tracking-wide">
            乐山幺鸡麻将算分器
          </h1>
          <span className="text-3xl md:text-4xl">🀅</span>
        </div>
        <p className="text-center text-emerald-100 text-sm md:text-base flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          实时算番 · 精准赔付 · 鸡番加倍
          <Sparkles className="w-4 h-4" />
        </p>
      </div>
    </header>
  );
}
