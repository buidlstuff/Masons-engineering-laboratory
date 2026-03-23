import type { ModelInfo, ProviderInfo } from '~/types/model';
import { useEffect, useState } from 'react';
import { classNames } from '~/utils/classNames';

interface ModelSelectorProps {
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  modelList: ModelInfo[];
  providerList: ProviderInfo[];
  apiKeys?: Record<string, string>;
  modelLoading?: boolean;
}

const FEATURED = [
  {
    providerName: 'Groq',
    modelName: 'llama-3.3-70b-versatile',
    label: '⚡ Groq',
    sublabel: 'Fast & Free',
  },
  {
    providerName: 'Google',
    modelName: 'gemini-2.0-flash',
    fallbackModel: 'gemini-1.5-flash',
    label: '✨ Gemini',
    sublabel: 'Smart & Free',
  },
];

export function ModelSelector({
  model,
  setModel,
  provider,
  setProvider,
  modelList,
  providerList,
  modelLoading,
}: ModelSelectorProps) {
  const [showMore, setShowMore] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>(provider?.name ?? 'Groq');

  useEffect(() => {
    if (provider?.name) {
      setSelectedProvider(provider.name);
    }
  }, [provider?.name]);

  const isFeatured = FEATURED.some(
    (f) =>
      f.providerName === provider?.name &&
      (f.modelName === model || ('fallbackModel' in f && f.fallbackModel === model)),
  );

  function pickFeatured(f: (typeof FEATURED)[number]) {
    const prov = providerList.find((p) => p.name === f.providerName);
    if (!prov) return;
    let targetModel = modelList.find((m) => m.name === f.modelName && m.provider === f.providerName);
    if (!targetModel && 'fallbackModel' in f && f.fallbackModel) {
      targetModel = modelList.find((m) => m.name === f.fallbackModel && m.provider === f.providerName);
    }
    if (!targetModel) return;
    setProvider?.(prov);
    setModel?.(targetModel.name);
    setShowMore(false);
  }

  const filteredModels = modelList.filter((m) => m.provider === selectedProvider);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {FEATURED.map((f) => {
        const isActive =
          provider?.name === f.providerName &&
          (model === f.modelName || ('fallbackModel' in f && model === f.fallbackModel));
        return (
          <button
            key={f.label}
            onClick={() => pickFeatured(f)}
            className={classNames(
              'flex flex-col items-center px-3 py-1 rounded-full text-xs font-medium border transition-all',
              isActive
                ? 'bg-accent text-white border-accent shadow-sm'
                : 'bg-bolt-elements-background-depth-1 text-bolt-elements-textSecondary border-bolt-elements-borderColor hover:border-accent hover:text-accent',
            )}
          >
            <span>{f.label}</span>
            <span className="text-[10px] opacity-70">{f.sublabel}</span>
          </button>
        );
      })}

      <button
        onClick={() => setShowMore((s) => !s)}
        className={classNames(
          'px-3 py-1 rounded-full text-xs border transition-all',
          showMore
            ? 'bg-bolt-elements-background-depth-2 text-bolt-elements-textPrimary border-bolt-elements-borderColor'
            : !isFeatured
              ? 'border-accent text-accent'
              : 'text-bolt-elements-textSecondary border-bolt-elements-borderColor hover:text-bolt-elements-textPrimary',
        )}
      >
        {showMore ? '✕ Close' : !isFeatured ? `⚙️ ${provider?.name} / ${model}` : 'More models →'}
      </button>

      {showMore && (
        <div className="w-full flex items-center gap-2 mt-1">
          <select
            value={selectedProvider}
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              const prov = providerList.find((p) => p.name === e.target.value);
              if (prov) {
                setProvider?.(prov);
                const firstModel = modelList.find((m) => m.provider === e.target.value);
                if (firstModel) setModel?.(firstModel.name);
              }
            }}
            className="flex-shrink-0 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary text-xs px-2 py-1"
          >
            {providerList.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={model}
            onChange={(e) => setModel?.(e.target.value)}
            className="flex-1 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-prompt-background text-bolt-elements-textPrimary text-xs px-2 py-1"
            disabled={modelLoading}
          >
            {filteredModels.map((m) => (
              <option key={m.name} value={m.name}>
                {m.label || m.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
