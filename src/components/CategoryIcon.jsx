import React from 'react';
import * as Icons from 'lucide-react';

export default function CategoryIcon({ name, className = "w-5 h-5", color }) {
  const IconComponent = Icons[name] || Icons.Grid;
  return <IconComponent className={className} style={color ? { color } : undefined} />;
}
