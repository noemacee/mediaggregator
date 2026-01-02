interface MediaLogoProps {
  name: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MediaLogo = ({ name, logoUrl, size = 'md', className = '' }: MediaLogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color from name for consistency
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-blue-600',
      'bg-purple-600',
      'bg-green-600',
      'bg-red-600',
      'bg-indigo-600',
      'bg-pink-600',
      'bg-yellow-600',
      'bg-teal-600'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex-shrink-0`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Hide broken image, show initials instead
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full ${getColorFromName(name)} rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold">${getInitials(name)}</span>
                </div>
              `;
            }
          }}
        />
      ) : (
        <div className={`w-full h-full ${getColorFromName(name)} rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold">{getInitials(name)}</span>
        </div>
      )}
    </div>
  );
};

export default MediaLogo;
