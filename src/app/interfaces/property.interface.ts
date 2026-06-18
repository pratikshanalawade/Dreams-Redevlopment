export interface Property {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  ownerId: string;
  status: 'Initiated' | 'Planning' | 'Approvals' | 'Demolition' | 'Construction' | 'Handover';
  progressPercentage: number;
  startDate: string;
  expectedCompletionDate: string;
  totalArea: string;
  rentersCount: number;
}
