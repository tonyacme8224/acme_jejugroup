export type TabType = 'home' | 'schedule' | 'guide' | 'hotel' | 'more';

export interface Participant {
  id: string;
  nameKr: string;
  nameEn: string;
  gender: 'F' | 'M';
  birthDate: string; // YYYY.MM.DD
  passportNo: string;
  issueDate: string; // YYYY.MM.DD
  expiryDate: string; // YYYY.MM.DD
  phone: string; // 010-XXXX-XXXX
  phoneLast4: string; // 4 digits
  isStaff: boolean;
  role: 'student' | 'escort' | 'staff';
  roomMalaysia: string; // e.g. "1318호"
  roomSingapore: string; // e.g. "미정 (체크인 시 안내)" or "602호"
  roommateKr: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  allergies?: string;
  flightMeal?: string;
  levelTestScore?: string;
}

export interface DaySchedule {
  dayNumber: number;
  dateStr: string; // "8월 10일 월요일"
  dateFormatted: string; // "2026-08-10"
  title: string; // "출국 및 오리엔테이션"
  tag: '출국' | '교육일' | '싱가포르' | '귀국';
  location: '제주/말레이시아' | '조호바루' | '싱가포르' | '제주';
  items: {
    time?: string;
    activity: string;
    note?: string;
    isHighlight?: boolean;
  }[];
}

export interface ClassTimetableItem {
  time: string;
  type: '수업' | '식사' | '활동' | '휴식';
  title: string;
  subtitle?: string;
  isImportant?: boolean;
}

export interface FlightInfo {
  type: 'outbound' | 'inbound';
  route: string; // "제주 → 싱가포르"
  airline: string; // "스쿠트항공"
  flightNo: string; // "TR829"
  date: string; // "2026년 8월 10일 월요일"
  departureTime: string; // "09:30"
  departureAirport: string; // "제주국제공항 (CJU)"
  arrivalTime: string; // "14:35"
  arrivalAirport: string; // "싱가포르 창이공항 (SIN)"
  timeBasis: string; // "현지시간 기준"
}

export interface HotelInfo {
  id: string;
  country: string; // "말레이시아 조호바루" or "싱가포르"
  nameKr: string; // "뉴욕호텔"
  nameEn: string; // "New York Hotel Johor Bahru"
  address: string;
  type: string; // "2인 1실"
  period: string; // "2026년 8월 10일 ~ 8월 18일 (8박)"
  roomsCount: string; // "11실"
  phone: string;
  mapUrl: string;
  rules: string[];
}

export interface ChecklistCategory {
  category: string;
  items: {
    id: string;
    text: string;
    isRequired: boolean;
    note?: string;
  }[];
}

export interface EmergencyNotice {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isUrgent: boolean;
  author: string;
}

export interface InsuranceCoverage {
  item: string;
  amount: string;
  desc?: string;
}
