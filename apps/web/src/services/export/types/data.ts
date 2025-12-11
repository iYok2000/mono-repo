export interface VocExportData {
  no: number;
  vocNo: string;
  peaOffice: string;
  refNoPea: string;
  workingDaysOpen: number;
  calendarDaysOpen: number;
  dateSentPea: string;
  dateFirstContact: string;
  datePeaReceived: string;
  datePeaCompleted: string;
  daysToAccept: number;
  dateClosed: string;
  customerName: string;
  customerCode: string;
  customerGroup: string;
  customerType: string;
  channel: string;
  requestType: string;
  topic: string;
  issue: string;
  subIssue: string;
  rootCause: string;
  incidentLocation: string;
  phone: string;
  email: string;
  contactLocation: string;
  details: string;
  cause: string;
  solution: string;
  result: string;
  consent: string;
  status: string;
  satisfaction: string;
  changedFrom: string;
  trackingStatus: string;
}

export interface CustomerGroupData {
  customerGroup: string;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  avgResolutionDays: number;
  satisfactionRate: number;
}

export interface AreaSummaryData {
  area: string;
  peaOffice: string;
  totalComplaints: number;
  pendingComplaints: number;
  avgResponseTime: number;
  completionRate: number;
}

export interface QuarterlySummaryData {
  quarter: string;
  year: number;
  totalComplaints: number;
  byChannel: Record<string, number>;
  topIssues: Array<{ issue: string; count: number }>;
  avgResolutionDays: number;
}

export interface AnnualSummaryData {
  year: number;
  totalComplaints: number;
  quarterlyBreakdown: QuarterlySummaryData[];
  yearlyTrends: Record<string, number>;
  topCustomerGroups: Array<{ group: string; count: number }>;
}
