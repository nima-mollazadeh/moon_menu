/*
 * منوی نمونه برای نمایش عملکرد وب‌سایت است، نه منوی واقعی رستوران.
 * نام، توضیح، تصویر و قیمت‌ها را با اطلاعات تأییدشده خودتان جایگزین کنید.
 * قیمت‌ها بر حسب تومان‌اند.
 */
window.MOON_CATEGORIES = [
  { id: "burgers", label: "برگرها", title: "برگرها", intro: "" },
  { id: "pizzas", label: "پیتزاها", title: "پیتزاها", intro: "" },
  { id: "sandwiches", label: "ساندویچ‌ها", title: "ساندویچ‌ها", intro: "" },
  { id: "fried", label: "سوخاری", title: "سوخاری", intro: "" },
  { id: "sides", label: "پیش‌غذا و سیب‌زمینی", title: "پیش‌غذا و سیب‌زمینی", intro: "" },
  { id: "salads", label: "سالادها", title: "سالادها", intro: "" },
  { id: "drinks", label: "نوشیدنی‌ها", title: "نوشیدنی‌ها", intro: "" },
  { id: "desserts", label: "دسرها", title: "دسرها", intro: "" }
];

const burgerSizes = { id: "size", label: "اندازه غذا", type: "radio", options: [
  { label: "معمولی", value: "regular", price: 0 }, { label: "دوبل", value: "double", price: 85000 }
]};
const burgerExtras = { id: "extras", label: "افزودنی‌های دلخواه", type: "checkbox", options: [
  { label: "پنیر اضافه", value: "extra-cheese", price: 25000 }, { label: "قارچ", value: "mushroom", price: 30000 }, { label: "بیکن گوشت", value: "beef-bacon", price: 45000 }
]};
const pizzaSizes = { id: "size", label: "اندازه پیتزا", type: "radio", options: [
  { label: "تک‌نفره", value: "solo", price: 0 }, { label: "دو نفره", value: "medium", price: 90000 }, { label: "خانوادگی", value: "family", price: 190000 }
]};
const pizzaExtras = { id: "extras", label: "افزودنی‌های دلخواه", type: "checkbox", options: [
  { label: "پنیر اضافه", value: "extra-cheese", price: 35000 }, { label: "قارچ اضافه", value: "mushroom", price: 25000 }, { label: "زیتون", value: "olive", price: 20000 }
]};
const sauceChoice = { id: "sauce", label: "سس کنار غذا", type: "radio", options: [
  { label: "سس مخصوص", value: "house", price: 0 }, { label: "سس تند", value: "spicy", price: 0 }, { label: "بدون سس", value: "none", price: 0 }
]};

window.MOON_PRODUCTS = [
  { id:"classic-burger", name:"کلاسیک برگر", desc:"برگر گوشت، کاهو، گوجه و سس مخصوص", price:245000, category:"burgers", image:"assets/images/burger.jpg", alt:"برگر کلاسیک با پنیر و سبزیجات", popular:true, badge:"محبوب", customizations:[burgerSizes,burgerExtras,sauceChoice] },
  { id:"cheeseburger", name:"چیزبرگر", desc:"گوشت گریل‌شده با پنیر ورقه‌ای و خیارشور", price:275000, category:"burgers", image:"assets/images/burger.jpg", alt:"چیزبرگر تازه با پنیر", popular:true, badge:"پرفروش", customizations:[burgerSizes,burgerExtras,sauceChoice] },
  { id:"double-burger", name:"دوبل برگر", desc:"دو لایه برگر، پنیر و سس دودی", price:365000, category:"burgers", image:"assets/images/burger.jpg", alt:"برگر دوبل با لایه‌های گوشت و پنیر", popular:true, customizations:[burgerExtras,sauceChoice] },
  { id:"chicken-burger", name:"چیکن برگر", desc:"مرغ سوخاری، کاهوی تازه و سس کرمی", price:230000, category:"burgers", image:"assets/images/chicken-burger.jpg", alt:"ساندویچ مرغ سوخاری", customizations:[sauceChoice] },

  { id:"pepperoni-pizza", name:"پیتزا پپرونی", desc:"پپرونی، پنیر کش‌دار و سس گوجه", price:320000, category:"pizzas", image:"assets/images/pizza.jpg", alt:"پیتزای پپرونی با پنیر آب‌شده", popular:true, badge:"محبوب", customizations:[pizzaSizes,pizzaExtras] },
  { id:"moon-special-pizza", name:"پیتزا مخصوص MOON", desc:"ترکیب گوشت، قارچ، فلفل دلمه‌ای و پنیر", price:375000, category:"pizzas", image:"assets/images/pizza.jpg", alt:"پیتزای مخصوص با مواد متنوع", popular:true, badge:"پیشنهاد ما", customizations:[pizzaSizes,pizzaExtras] },
  { id:"chicken-mushroom-pizza", name:"پیتزا مرغ و قارچ", desc:"مرغ مزه‌دار، قارچ تازه و پنیر", price:345000, category:"pizzas", image:"assets/images/pizza.jpg", alt:"پیتزا با مرغ و قارچ", customizations:[pizzaSizes,pizzaExtras] },
  { id:"veggie-pizza", name:"پیتزا سبزیجات", desc:"فلفل دلمه‌ای، قارچ، زیتون و ذرت", price:285000, category:"pizzas", image:"assets/images/pizza.jpg", alt:"پیتزای سبزیجات رنگارنگ", customizations:[pizzaSizes,pizzaExtras] },

  { id:"hot-dog", name:"هات‌داگ", desc:"هات‌داگ گریل‌شده با پیاز و سس مخصوص", price:195000, category:"sandwiches", image:"assets/images/hotdog.jpg", alt:"هات‌داگ با مخلفات", customizations:[sauceChoice] },
  { id:"steak-sandwich", name:"ساندویچ استیک", desc:"گوشت نواری، قارچ و فلفل دلمه‌ای", price:325000, category:"sandwiches", image:"assets/images/steak-sandwich.jpg", alt:"ساندویچ گوشت و سبزیجات", customizations:[sauceChoice] },
  { id:"grilled-chicken-sandwich", name:"ساندویچ مرغ گریل", desc:"مرغ گریل، کاهو، گوجه و سس ماست", price:245000, category:"sandwiches", image:"assets/images/chicken-burger.jpg", alt:"ساندویچ مرغ گریل با سبزیجات", customizations:[sauceChoice] },
  { id:"ham-sandwich", name:"ساندویچ ژامبون", desc:"ژامبون، پنیر، خیارشور و سس خردل", price:210000, category:"sandwiches", image:"assets/images/steak-sandwich.jpg", alt:"ساندویچ ژامبون و پنیر" },

  { id:"fried-fillet", name:"فیله سوخاری", desc:"فیله‌های مرغ ترد با ادویه مخصوص", price:265000, category:"fried", image:"assets/images/fried-chicken.jpg", alt:"تکه‌های مرغ سوخاری", popular:true, badge:"ترد و خوشمزه", customizations:[sauceChoice] },
  { id:"chicken-strips", name:"استریپس مرغ", desc:"تکه‌های فیله سوخاری، مناسب دیپ کردن", price:235000, category:"fried", image:"assets/images/fried-chicken.jpg", alt:"استریپس مرغ طلایی", customizations:[sauceChoice] },
  { id:"fried-box", name:"باکس سوخاری", desc:"ترکیبی از فیله و تکه‌های مرغ سوخاری", price:395000, category:"fried", image:"assets/images/fried-chicken.jpg", alt:"باکس مرغ سوخاری" },
  { id:"spicy-chicken", name:"مرغ اسپایسی", desc:"مرغ سوخاری با ادویه تند و خوش‌عطر", price:285000, category:"fried", image:"assets/images/fried-chicken.jpg", alt:"مرغ سوخاری ادویه‌دار", customizations:[sauceChoice] },

  { id:"fries", name:"سیب‌زمینی ساده", desc:"سیب‌زمینی سرخ‌شده با نمک و ادویه", price:95000, category:"sides", image:"assets/images/fries.svg", alt:"سیب‌زمینی سرخ‌شده طلایی", popular:true },
  { id:"cheese-fries", name:"سیب‌زمینی پنیری", desc:"سیب‌زمینی ترد با سس پنیر گرم", price:145000, category:"sides", image:"assets/images/fries.svg", alt:"سیب‌زمینی پنیری", customizations:[{id:"topping",label:"افزودنی",type:"checkbox",options:[{label:"هالوپینو",value:"jalapeno",price:20000},{label:"سس اضافه",value:"extra-sauce",price:15000}]}] },
  { id:"nuggets", name:"ناگت مرغ", desc:"ناگت‌های ترد با سس انتخابی", price:135000, category:"sides", image:"assets/images/fried-chicken.jpg", alt:"ناگت مرغ ترد", customizations:[sauceChoice] },
  { id:"onion-rings", name:"حلقه پیاز", desc:"حلقه‌های پیاز سوخاری و طلایی", price:115000, category:"sides", image:"assets/images/fries.svg", alt:"حلقه‌های پیاز سوخاری" },

  { id:"caesar-salad", name:"سالاد سزار", desc:"کاهو، مرغ گریل، نان کروتان و سس سزار", price:225000, category:"salads", image:"assets/images/salad.svg", alt:"سالاد سزار با مرغ و کاهو", customizations:[{id:"dressing",label:"سس سالاد",type:"radio",options:[{label:"سس سزار",value:"caesar",price:0},{label:"سس جدا",value:"side",price:0},{label:"بدون سس",value:"none",price:0}]}] },
  { id:"garden-salad", name:"سالاد فصل", desc:"کاهو، خیار، گوجه و سبزیجات تازه", price:125000, category:"salads", image:"assets/images/salad.svg", alt:"سالاد فصل تازه" },
  { id:"chicken-salad", name:"سالاد مرغ", desc:"مرغ گریل با سبزیجات تازه و دیپ سبک", price:195000, category:"salads", image:"assets/images/salad.svg", alt:"سالاد مرغ و سبزیجات" },

  { id:"cola", name:"نوشابه", desc:"نوشابه قوطی خنک", price:35000, category:"drinks", image:"assets/images/soda.svg", alt:"نوشیدنی خنک در لیوان" },
  { id:"doogh", name:"دوغ", desc:"دوغ خنک برای کنار غذا", price:30000, category:"drinks", image:"assets/images/soda.svg", alt:"نوشیدنی خنک" },
  { id:"water", name:"آب معدنی", desc:"آب معدنی بطری", price:15000, category:"drinks", image:"assets/images/soda.svg", alt:"بطری آب" },
  { id:"flavored-drink", name:"نوشیدنی طعم‌دار", desc:"نوشیدنی میوه‌ای خنک", price:45000, category:"drinks", image:"assets/images/soda.svg", alt:"نوشیدنی میوه‌ای خنک" },

  { id:"brownie", name:"براونی شکلاتی", desc:"براونی نرم با طعم شکلات غلیظ", price:95000, category:"desserts", image:"assets/images/dessert.svg", alt:"براونی شکلاتی", popular:true },
  { id:"cheesecake", name:"چیزکیک", desc:"چیزکیک خامه‌ای با لایه بیسکویتی", price:120000, category:"desserts", image:"assets/images/dessert.svg", alt:"برش چیزکیک" },
  { id:"ice-cream", name:"بستنی", desc:"بستنی خنک برای آخر سفارش", price:65000, category:"desserts", image:"assets/images/dessert.svg", alt:"بستنی در کاسه" }
];
