export interface Agreement {
  id: string;
  propertyId: string;
  propertyName: string;
  parties: string[];
  type: 'Redevelopment' | 'Tenant Reallocation' | 'Lump Sum Settlement';
  status: 'Draft' | 'Pending Review' | 'Signed' | 'Expired';
  signedDate?: string;
  expiryDate?: string;
  pdfUrl?: string;
  terms: string[];
}
