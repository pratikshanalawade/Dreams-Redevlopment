export interface Payment {
  id: string;
  propertyId: string;
  propertyName: string;
  recipientName: string;
  amount: number;
  type: 'Rent Allowance' | 'Reconstruction Payout' | 'Lump Sum Settlement';
  status: 'Pending' | 'Processed' | 'Failed';
  date: string;
  transactionHash?: string;
}
