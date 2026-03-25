export const getSriLankanHolidays = (year, month) => {
  // Comprehensive localized dictionary of major Sri Lankan public, bank, 
  // and mercantile holidays for the year 2026 (including Poya days)
  
  const holidays2026 = {
    0: { 14: 'Tamil Thai Pongal Day', 28: 'Duruthu Full Moon Poya Day' },
    1: { 4: 'National Day', 27: 'Navam Full Moon Poya Day' },
    2: { 2: 'Madin Full Moon Poya Day', 8: 'Maha Shivaratri Day' },
    3: { 3: 'Good Friday', 10: 'Id-Ul-Fitr (Ramazan)', 13: 'Day Prior to Sinhala & Tamil New Year', 14: 'Sinhala & Tamil New Year', 27: 'Bak Full Moon Poya Day' },
    4: { 1: 'May Day', 26: 'Vesak Full Moon Poya Day', 27: 'Day following Vesak Poya' },
    5: { 25: 'Poson Full Moon Poya Day' },
    6: { 24: 'Esala Full Moon Poya Day' },
    7: { 23: 'Nikini Full Moon Poya Day' },
    8: { 16: "Milad-Un-Nabi (Holy Prophet's Birthday)", 21: 'Binara Full Moon Poya Day' },
    9: { 21: 'Vap Full Moon Poya Day', 31: 'Deepavali' },
    10: { 19: 'Il Full Moon Poya Day' },
    11: { 19: 'Unduvap Full Moon Poya Day', 25: 'Christmas Day' }
  };

  if (year === 2026 && holidays2026[month]) {
    return holidays2026[month];
  }
  
  return {}; // Expand to other years natively if required
};
