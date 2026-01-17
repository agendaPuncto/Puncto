export interface DashboardWidget {
  id: string;
  type: 'bookings' | 'revenue' | 'customerSegments' | 'inventory' | 'custom';
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: Record<string, any>;
}

export interface Dashboard {
  id: string;
  businessId: string;
  name: string;
  widgets: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
}
