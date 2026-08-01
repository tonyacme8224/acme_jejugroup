import scootMeal1 from '../assets/images/scoot_meal_1_1785577391273.jpg';
import scootMeal2 from '../assets/images/scoot_meal_2_1785577406695.jpg';
import scootMeal3 from '../assets/images/scoot_meal_3_1785577425885.jpg';
import twayMeal1 from '../assets/images/tway_meal_1_real_1785577653304.jpg';
import twayMeal2 from '../assets/images/tway_meal_2_real_1785577671294.jpg';
import twayMeal3 from '../assets/images/tway_meal_3_real_1785577684923.jpg';
import twayMeal4 from '../assets/images/tway_meal_4_real_1785577709056.jpg';

export interface MealMenuItem {
  id: number;
  menuNumber: number;
  name: string;
  nameEn?: string;
  airline: '스쿠트' | '티웨이';
  flightType: '출국편' | '귀국편';
  description: string;
  badgeColor: string;
  categoryName: string;
  imageUrl: string;
}

export interface StudentMealSelection {
  id: number; // 1 ~ 22
  nameKr: string;
  outboundMealId: number; // 1, 2, 3
  inboundMealId: number;  // 1, 2, 3, 4
}

// 1. 出國 (Scoot) Meals (1번~3번)
export const OUTBOUND_MEALS: MealMenuItem[] = [
  {
    id: 1,
    menuNumber: 1,
    name: '1번 (Curry Chicken Briyani Rice)',
    nameEn: 'Curry Chicken Briyani Rice',
    airline: '스쿠트',
    flightType: '출국편',
    categoryName: '스쿠트 기내식 1호',
    description: 'Curry Chicken Briyani Rice (카레 치킨 브리야니 라이스 + 음료 & 브라우니 디저트)',
    badgeColor: 'bg-blue-600 text-white',
    imageUrl: scootMeal1,
  },
  {
    id: 2,
    menuNumber: 2,
    name: '2번 (Pomodoro Pasta)',
    nameEn: 'Pomodoro Pasta',
    airline: '스쿠트',
    flightType: '출국편',
    categoryName: '스쿠트 기내식 2호',
    description: 'Pomodoro Pasta (토마토 포모도로 파스타 + 음료 & 스낵)',
    badgeColor: 'bg-blue-600 text-white',
    imageUrl: scootMeal2,
  },
  {
    id: 3,
    menuNumber: 3,
    name: '3번 (Three Beans Tofu Curry Basmati Rice)',
    nameEn: 'Three Beans Tofu Curry Basmati Rice',
    airline: '스쿠트',
    flightType: '출국편',
    categoryName: '스쿠트 기내식 3호',
    description: 'Three Beans Tofu Curry Basmati Rice (쓰리 빈즈 두부 카레 바스마티 라이스 + 음료 & 스낵)',
    badgeColor: 'bg-blue-600 text-white',
    imageUrl: scootMeal3,
  },
];

// 2. 歸國 (t'way) Meals (1번~4번)
export const INBOUND_MEALS: MealMenuItem[] = [
  {
    id: 1,
    menuNumber: 1,
    name: '1번 (비벼진 비빔밥)',
    nameEn: 'Mixed Bibimbap',
    airline: '티웨이',
    flightType: '귀국편',
    categoryName: '티웨이 기내식 1호',
    description: '비벼진 비빔밥 (영양 가득 나물, 소고기, 버섯이 고루 들어간 따뜻한 비빔밥)',
    badgeColor: 'bg-emerald-600 text-white',
    imageUrl: twayMeal1,
  },
  {
    id: 2,
    menuNumber: 2,
    name: '2번 (폭찹 스테이크)',
    nameEn: 'Pork Chop Steak',
    airline: '티웨이',
    flightType: '귀국편',
    categoryName: '티웨이 기내식 2호',
    description: '폭찹 스테이크 (부드러운 도톰한 돼지고기 스테이크와 야채, 감자 매시)',
    badgeColor: 'bg-emerald-600 text-white',
    imageUrl: twayMeal2,
  },
  {
    id: 3,
    menuNumber: 3,
    name: '3번 (소고기 버섯죽)',
    nameEn: 'Beef & Mushroom Porridge',
    airline: '티웨이',
    flightType: '귀국편',
    categoryName: '티웨이 기내식 3호',
    description: '소고기 버섯죽 (속 편하고 부드러운 고소한 소고기 버섯죽)',
    badgeColor: 'bg-emerald-600 text-white',
    imageUrl: twayMeal3,
  },
  {
    id: 4,
    menuNumber: 4,
    name: '4번 (소시지 에그 브런치)',
    nameEn: 'Sausage Egg Brunch',
    airline: '티웨이',
    flightType: '귀국편',
    categoryName: '티웨이 기내식 4호',
    description: '소시지 에그 브런치 (탱글한 소시지와 스크램블 에그, 해시브라운, 콩요리)',
    badgeColor: 'bg-emerald-600 text-white',
    imageUrl: twayMeal4,
  },
];

// 3. Student Meal Survey Selections (22 Students)
export const STUDENT_MEAL_SELECTIONS: StudentMealSelection[] = [
  { id: 1, nameKr: '강다원', outboundMealId: 1, inboundMealId: 4 },
  { id: 2, nameKr: '고채영', outboundMealId: 3, inboundMealId: 3 },
  { id: 3, nameKr: '김가연', outboundMealId: 1, inboundMealId: 1 },
  { id: 4, nameKr: '김미소', outboundMealId: 2, inboundMealId: 1 },
  { id: 5, nameKr: '김민혁', outboundMealId: 1, inboundMealId: 2 },
  { id: 6, nameKr: '김애영', outboundMealId: 1, inboundMealId: 1 },
  { id: 7, nameKr: '김예지', outboundMealId: 2, inboundMealId: 2 },
  { id: 8, nameKr: '김하민', outboundMealId: 1, inboundMealId: 3 },
  { id: 9, nameKr: '김현경', outboundMealId: 2, inboundMealId: 2 },
  { id: 10, nameKr: '양소연', outboundMealId: 2, inboundMealId: 1 },
  { id: 11, nameKr: '양예서', outboundMealId: 3, inboundMealId: 1 },
  { id: 12, nameKr: '윤지수', outboundMealId: 1, inboundMealId: 2 },
  { id: 13, nameKr: '이가연', outboundMealId: 1, inboundMealId: 1 },
  { id: 14, nameKr: '이하진', outboundMealId: 1, inboundMealId: 2 },
  { id: 15, nameKr: '장영은', outboundMealId: 1, inboundMealId: 2 },
  { id: 16, nameKr: '장은지', outboundMealId: 1, inboundMealId: 1 },
  { id: 17, nameKr: '조지윤', outboundMealId: 1, inboundMealId: 2 },
  { id: 18, nameKr: '진다혜', outboundMealId: 2, inboundMealId: 1 },
  { id: 19, nameKr: '현수민', outboundMealId: 1, inboundMealId: 2 },
  { id: 20, nameKr: '홍민서', outboundMealId: 2, inboundMealId: 4 },
  { id: 21, nameKr: '홍승완', outboundMealId: 2, inboundMealId: 2 },
  { id: 22, nameKr: '고미영', outboundMealId: 3, inboundMealId: 1 },
];

/**
 * Helper to get outbound meal info by ID
 */
export const getOutboundMeal = (id: number): MealMenuItem => {
  return OUTBOUND_MEALS.find(m => m.menuNumber === id) || {
    id,
    menuNumber: id,
    name: `${id}번 메뉴`,
    airline: '스쿠트',
    flightType: '출국편',
    categoryName: `스쿠트 ${id}번`,
    description: `스쿠트항공 ${id}번 메뉴`,
    badgeColor: 'bg-blue-600 text-white',
    imageUrl: OUTBOUND_MEALS[0].imageUrl,
  };
};

/**
 * Helper to get inbound meal info by ID
 */
export const getInboundMeal = (id: number): MealMenuItem => {
  return INBOUND_MEALS.find(m => m.menuNumber === id) || {
    id,
    menuNumber: id,
    name: `${id}번 메뉴`,
    airline: '티웨이',
    flightType: '귀국편',
    categoryName: `티웨이 ${id}번`,
    description: `티웨이항공 ${id}번 메뉴`,
    badgeColor: 'bg-emerald-600 text-white',
    imageUrl: INBOUND_MEALS[0].imageUrl,
  };
};
