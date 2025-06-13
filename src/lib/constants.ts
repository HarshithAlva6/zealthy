import { FileText, MapPin, Calendar, LucideIcon } from 'lucide-react';

export type ComponentType = {
  label: string;
  icon: LucideIcon;
};

export const COMPONENT_TYPES: Record<string, ComponentType> = {
  about: { label: 'About Me', icon: FileText },
  address: { label: 'Address', icon: MapPin },
  birthdate: { label: 'Birthdate', icon: Calendar }
};