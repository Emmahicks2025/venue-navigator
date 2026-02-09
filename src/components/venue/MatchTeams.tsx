import { getFlagUrl } from '@/lib/countryFlags';
import { Globe } from 'lucide-react';

interface MatchTeamsProps {
  homeTeam: string;
  awayTeam: string;
  /** 'sm' for compact cards, 'md' for standard, 'lg' for detail pages */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { flag: 20, text: 'text-sm', gap: 'gap-1.5', ball: 'text-xs', icon: 14 },
  md: { flag: 28, text: 'text-lg', gap: 'gap-2', ball: 'text-sm', icon: 20 },
  lg: { flag: 40, text: 'text-xl lg:text-2xl', gap: 'gap-3', ball: 'text-base', icon: 28 },
};

function FlagOrPlaceholder({ team, flagUrl, flagSize, iconSize }: { team: string; flagUrl: string; flagSize: number; iconSize: number }) {
  if (flagUrl) {
    return (
      <img
        src={flagUrl}
        alt={team}
        className="rounded-sm object-cover shadow-sm"
        style={{ width: flagSize, height: flagSize * 0.67 }}
        loading="lazy"
      />
    );
  }
  return <Globe size={iconSize} className="text-muted-foreground shrink-0" />;
}

export function MatchTeams({ homeTeam, awayTeam, size = 'md', className = '' }: MatchTeamsProps) {
  const cfg = sizeConfig[size];
  const homeFlag = getFlagUrl(homeTeam, cfg.flag * 2);
  const awayFlag = getFlagUrl(awayTeam, cfg.flag * 2);

  return (
    <div className={`flex items-center ${cfg.gap} ${className}`}>
      <FlagOrPlaceholder team={homeTeam} flagUrl={homeFlag} flagSize={cfg.flag} iconSize={cfg.icon} />
      <span className={`font-semibold ${cfg.text}`}>{homeTeam}</span>
      <span className={cfg.ball}>⚽</span>
      <span className={`font-semibold ${cfg.text}`}>{awayTeam}</span>
      <FlagOrPlaceholder team={awayTeam} flagUrl={awayFlag} flagSize={cfg.flag} iconSize={cfg.icon} />
    </div>
  );
}
