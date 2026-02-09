import { getFlagUrl } from '@/lib/countryFlags';

interface MatchTeamsProps {
  homeTeam: string;
  awayTeam: string;
  /** 'sm' for compact cards, 'md' for standard, 'lg' for detail pages */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { flag: 20, text: 'text-sm', gap: 'gap-1.5', ball: 'text-xs' },
  md: { flag: 28, text: 'text-lg', gap: 'gap-2', ball: 'text-sm' },
  lg: { flag: 40, text: 'text-xl lg:text-2xl', gap: 'gap-3', ball: 'text-base' },
};

export function MatchTeams({ homeTeam, awayTeam, size = 'md', className = '' }: MatchTeamsProps) {
  const cfg = sizeConfig[size];
  const homeFlag = getFlagUrl(homeTeam, cfg.flag * 2); // 2x for retina
  const awayFlag = getFlagUrl(awayTeam, cfg.flag * 2);

  return (
    <div className={`flex items-center ${cfg.gap} ${className}`}>
      {homeFlag && (
        <img
          src={homeFlag}
          alt={homeTeam}
          className="rounded-sm object-cover shadow-sm"
          style={{ width: cfg.flag, height: cfg.flag * 0.67 }}
          loading="lazy"
        />
      )}
      <span className={`font-semibold ${cfg.text}`}>{homeTeam}</span>
      <span className={cfg.ball}>⚽</span>
      <span className={`font-semibold ${cfg.text}`}>{awayTeam}</span>
      {awayFlag && (
        <img
          src={awayFlag}
          alt={awayTeam}
          className="rounded-sm object-cover shadow-sm"
          style={{ width: cfg.flag, height: cfg.flag * 0.67 }}
          loading="lazy"
        />
      )}
    </div>
  );
}
