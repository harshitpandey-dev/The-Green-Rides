// Shared styles and theme constants for The Green Rides mobile app
import { StyleSheet } from 'react-native';

// Theme colors matching web frontend
export const COLORS = {
  primary: '#27ae60',
  primaryHover: '#219a52',
  success: '#2ecc71',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#3498db',
  secondary: '#95a5a6',
  dark: '#2c3e50',
  light: '#ecf0f1',
  background: '#f8f9fa',
  white: '#ffffff',
  borderLight: '#e9ecef',
  text: '#2c3e50',
  textSecondary: '#95a5a6',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  shadowHover: 'rgba(39, 174, 96, 0.2)',
};

// Common dimensions
export const SIZES = {
  padding: 16,
  margin: 16,
  borderRadius: 12,
  iconSize: 24,
  headerHeight: 60,
  buttonHeight: 48,
  cardElevation: 3,
};

// Shadow styles
export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  hover: {
    shadowColor: COLORS.shadowHover,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Common styles
export const COMMON_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    marginHorizontal: SIZES.margin,
    marginTop: SIZES.margin,
    marginBottom: SIZES.margin / 2,
    ...SHADOWS.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    marginHorizontal: SIZES.margin,
    marginBottom: SIZES.margin / 2,
    ...SHADOWS.light,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  secondaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.light,
  },
  dangerButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    fontSize: 16,
    color: COLORS.dark,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 6,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
  successText: {
    color: COLORS.success,
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  // Status badges
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  statusActive: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  statusActiveText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusDisabled: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  statusDisabledText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusAvailable: {
    backgroundColor: 'rgba(46, 204, 113, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  statusAvailableText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusRented: {
    backgroundColor: 'rgba(243, 156, 18, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.3)',
  },
  statusRentedText: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusMaintenance: {
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  statusMaintenanceText: {
    color: COLORS.info,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusOverdue: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  statusOverdueText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statusReturned: {
    backgroundColor: 'rgba(149, 165, 166, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(149, 165, 166, 0.3)',
  },
  statusReturnedText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  // Stats card styles
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.margin,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: SIZES.margin / 2,
    ...SHADOWS.light,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: COLORS.textSecondary,
  },
  statTotal: {
    color: COLORS.info,
  },
  statActive: {
    color: COLORS.success,
  },
  statSuspended: {
    color: COLORS.danger,
  },
});

// Utility functions
export const getStatusStyle = status => {
  switch (status?.toLowerCase()) {
    case 'active':
      return {
        badge: COMMON_STYLES.statusActive,
        text: COMMON_STYLES.statusActiveText,
      };
    case 'available':
      return {
        badge: COMMON_STYLES.statusAvailable,
        text: COMMON_STYLES.statusAvailableText,
      };
    case 'rented':
      return {
        badge: COMMON_STYLES.statusRented,
        text: COMMON_STYLES.statusRentedText,
      };
    case 'maintenance':
    case 'under_maintenance':
      return {
        badge: COMMON_STYLES.statusMaintenance,
        text: COMMON_STYLES.statusMaintenanceText,
      };
    case 'disabled':
    case 'suspended':
      return {
        badge: COMMON_STYLES.statusDisabled,
        text: COMMON_STYLES.statusDisabledText,
      };
    case 'overdue':
      return {
        badge: COMMON_STYLES.statusOverdue,
        text: COMMON_STYLES.statusOverdueText,
      };
    case 'returned':
      return {
        badge: COMMON_STYLES.statusReturned,
        text: COMMON_STYLES.statusReturnedText,
      };
    default:
      return {
        badge: COMMON_STYLES.statusDisabled,
        text: COMMON_STYLES.statusDisabledText,
      };
  }
};

export const formatTime = minutes => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatCurrency = amount => {
  return `₹${amount.toFixed(2)}`;
};
