import { Shield } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo = ({ size = 'md' }: BrandLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-brand via-brand-600 to-secondary flex items-center justify-center shadow-xl shadow-brand/30 ring-2 ring-brand/20 ring-offset-2 ring-offset-bg-dark-elevated`}>
      <Shield className="w-3/5 h-3/5 text-white drop-shadow-lg" />
    </div>
  );
};
