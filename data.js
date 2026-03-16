// data.js — populated in Tasks 2–4
const FOODS = {
  wheat:    { en: 'Wheat',         ar: 'قمح',  emoji: '🌾', majorityKg: 2.04, hanafiKg: 1.625 },
  barley:   { en: 'Barley',        ar: 'شعير', emoji: '🌾', majorityKg: 2.30, hanafiKg: 3.25  },
  dates:    { en: 'Dates',         ar: 'تمر',  emoji: '🌴', majorityKg: 1.80, hanafiKg: 3.25  },
  raisins:  { en: 'Raisins',       ar: 'زبيب', emoji: '🍇', majorityKg: 1.64, hanafiKg: 1.625 },
  rice:     { en: 'Rice',          ar: 'أرز',  emoji: '🍚', majorityKg: 2.30, hanafiKg: 2.50  },
  flour:    { en: 'Flour (wheat)', ar: 'دقيق', emoji: '🌾', majorityKg: 1.40, hanafiKg: 1.625 },
  semolina: { en: 'Semolina',      ar: 'سميد', emoji: '🌾', majorityKg: 2.50, hanafiKg: 2.50  },
  sorghum:  { en: 'Sorghum',       ar: 'ذرة',  emoji: '🌾', majorityKg: 2.30, hanafiKg: 2.30  },
  millet:   { en: 'Millet',        ar: 'دخن',  emoji: '🌾', majorityKg: 2.20, hanafiKg: 2.20  },
  aqit:     { en: 'Dried Cheese',  ar: 'أقط',  emoji: '🧀', majorityKg: 2.05, hanafiKg: 2.05  },
};

const COUNTRIES = [
  { code:'dz', en:'Algeria',      ar:'الجزائر',   primaryFoods:[{key:'semolina',kg:2.50}],                        defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'ma', en:'Morocco',      ar:'المغرب',    primaryFoods:[{key:'semolina',kg:2.50}],                        defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'tn', en:'Tunisia',      ar:'تونس',      primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'ly', en:'Libya',        ar:'ليبيا',     primaryFoods:[{key:'wheat',kg:2.25},{key:'rice',kg:2.00}],       defaultKg:2.25, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'eg', en:'Egypt',        ar:'مصر',       primaryFoods:[{key:'wheat',kg:2.04}],                           defaultKg:2.04, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'sd', en:'Sudan',        ar:'السودان',   primaryFoods:[{key:'wheat',kg:2.50},{key:'sorghum',kg:2.50}],   defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'so', en:'Somalia',      ar:'الصومال',   primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'sa', en:'Saudi Arabia', ar:'السعودية',  primaryFoods:[{key:'rice',kg:3.00}],                            defaultKg:3.00, madhab:'Hanbali', madhabAr:'الحنبلي'  },
  { code:'ae', en:'UAE',          ar:'الإمارات',  primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'jo', en:'Jordan',       ar:'الأردن',    primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'sy', en:'Syria',        ar:'سوريا',     primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'lb', en:'Lebanon',      ar:'لبنان',     primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'iq', en:'Iraq',         ar:'العراق',    primaryFoods:[{key:'wheat',kg:2.50}],                           defaultKg:2.50, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'tr', en:'Turkey',       ar:'تركيا',     primaryFoods:[{key:'flour',kg:2.50}],                           defaultKg:2.50, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'id', en:'Indonesia',    ar:'إندونيسيا', primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'my', en:'Malaysia',     ar:'ماليزيا',   primaryFoods:[{key:'rice',kg:2.70}],                            defaultKg:2.70, madhab:"Shafi'i", madhabAr:'الشافعي'  },
  { code:'pk', en:'Pakistan',     ar:'باكستان',   primaryFoods:[{key:'flour',kg:1.75}],                           defaultKg:1.75, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'in', en:'India',        ar:'الهند',     primaryFoods:[{key:'wheat',kg:2.04}],                           defaultKg:2.04, madhab:'Hanafi',  madhabAr:'الحنفي'   },
  { code:'sn', en:'Senegal',      ar:'السنغال',   primaryFoods:[{key:'rice',kg:2.50},{key:'millet',kg:2.20}],     defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'fr', en:'France',       ar:'فرنسا',     primaryFoods:[{key:'semolina',kg:2.50}],                        defaultKg:2.50, madhab:'Maliki',  madhabAr:'المالكي'  },
  { code:'us', en:'USA',          ar:'أمريكا',    primaryFoods:[{key:'rice',kg:2.04}],                            defaultKg:2.04, madhab:'Mixed',   madhabAr:'متعدد'    },
  { code:'gb', en:'UK',           ar:'بريطانيا',  primaryFoods:[{key:'rice',kg:2.50}],                            defaultKg:2.50, madhab:'Mixed',   madhabAr:'متعدد'    },
];

const SCHOLAR_PRESETS = [];
const TRANSLATIONS = { en: {}, ar: {} };
