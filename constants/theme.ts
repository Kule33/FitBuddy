/**
 * Theme colors for light and dark mode with consistent color accuracy
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Primary
    primary: '#007AFF',
    primaryLight: 'rgba(0, 122, 255, 0.1)',
    primaryShadow: 'rgba(0, 122, 255, 0.3)',
    
    // Background
    background: '#F8F9FA',
    card: '#FFFFFF',
    
    // Text
    text: '#1A1A1A',
    textSecondary: '#666',
    textTertiary: '#999',
    
    // Border
    border: '#F5F5F5',
    borderDark: '#E0E0E0',
    
    // Status Colors
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    // Exercise Difficulty
    beginner: '#34C759',
    intermediate: '#FF9500',
    expert: '#FF3B30',
    
    // UI Elements
    shadow: '#000',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Icons
    iconPrimary: '#007AFF',
    iconSecondary: '#666',
    iconTertiary: '#CCC',
    
    // Tab Bar
    tabBackground: '#FFFFFF',
    tabBorder: '#E0E0E0',
    tabActive: '#007AFF',
    tabInactive: '#999',
  },
  dark: {
    // Primary
    primary: '#0A84FF',
    primaryLight: 'rgba(10, 132, 255, 0.15)',
    primaryShadow: 'rgba(10, 132, 255, 0.4)',
    
    // Background
    background: '#000000',
    card: '#1C1C1E',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textTertiary: '#8E8E93',
    
    // Border
    border: '#2C2C2E',
    borderDark: '#3A3A3C',
    
    // Status Colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    
    // Exercise Difficulty
    beginner: '#30D158',
    intermediate: '#FF9F0A',
    expert: '#FF453A',
    
    // UI Elements
    shadow: '#000',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    // Icons
    iconPrimary: '#0A84FF',
    iconSecondary: '#EBEBF5',
    iconTertiary: '#636366',
    
    // Tab Bar
    tabBackground: '#1C1C1E',
    tabBorder: '#2C2C2E',
    tabActive: '#0A84FF',
    tabInactive: '#8E8E93',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
