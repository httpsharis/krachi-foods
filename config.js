/**
 * config.js — Karachi Foods Configuration
 */
window.KF_CONFIG = {
  shop: { lat: 31.4504, lng: 74.2931 }, // Gulshan-e-Mustafa C-2 UMT Road
  waNumber: '923457371958',
  
  // 24 Hours Operation
  hours: {
    dineInOpen: 0,
    dineInClose: 24
  },
  
  deliveryFee: 0,
  minOrder: 0,

  menu: [
    // DEALS
    {id:'d1', name:'Deal #1', desc:'Zinger Burger, Fries, 345ml Drink', price:590, cat:'Deals', tag:'Value', img:'images/deal_burger_fries.png'},
    {id:'d2', name:'Deal #2', desc:'Cheesy Shawarma, Fries, 345ml Drink', price:590, cat:'Deals', tag:'Value', img:'images/deal_shawarma_fries.png'},
    {id:'d3', name:'Deal #3', desc:'1 Wrap, Fries, 345ml Drink', price:820, cat:'Deals', tag:'Value', img:'images/deal_shawarma_fries.png'},
    {id:'d4', name:'Deal #4', desc:'1 Cheesy Grilled Sandwich, Loaded Fries, 2 Drinks', price:999, cat:'Deals', tag:'For Two', img:'images/deal_sandwich_fries.png'},
    {id:'d5', name:'Deal #5', desc:'2 Zinger Burgers, Fries, 2 Drinks', price:1140, cat:'Deals', tag:'For Two', img:'images/deal_burger_fries.png'},
    {id:'d6', name:'Deal #6', desc:'2 Cheesy Shawarmas, Fries, 2 Drinks', price:1140, cat:'Deals', tag:'For Two', img:'images/deal_family_shawarmas.png'},
    {id:'d7', name:'Deal #7', desc:'1 Wrap, 1 Club Sandwich, Fries, 2 Drinks', price:1470, cat:'Deals', tag:'Feast', img:'images/deal_sandwich_fries.png'},
    {id:'d8', name:'Deal #8', desc:'4 Zinger Burgers, 1L Drink', price:1690, cat:'Deals', tag:'Family', img:'images/deal_family_burgers.png'},
    {id:'d9', name:'Deal #9', desc:'4 Signature Shawarmas, Fries, 1L Drink', price:1750, cat:'Deals', tag:'Family', img:'images/deal_family_shawarmas.png'},
    
    // BURGERS
    {id:'b1', name:'Chicken Burger', price:300, cat:'Burgers', tag:'Classic', img:'images/burger.png'},
    {id:'b2', name:'Zinger Burger', price:390, cat:'Burgers', tag:'Bestseller', img:'images/burger.png'},
    {id:'b3', name:'Zinger Tower', price:550, cat:'Burgers', tag:'Hungry', img:'images/burger.png'},
    {id:'b4', name:'Mighty Zinger', price:650, cat:'Burgers', tag:'Massive', img:'images/burger.png'},
    {id:'b5', name:'Chicken Patty Burger', price:330, cat:'Burgers', tag:'Light', img:'images/burger.png'},
    {id:'b6', name:'Beef Patty Burger', price:450, cat:'Burgers', tag:'Grill', img:'images/burger.png'},
    
    // PIZZA
    {id:'p1', name:'Chicken Tikka Pizza (Small)', price:550, cat:'Pizza', tag:'Local', img:'images/pizza.png'},
    {id:'p2', name:'Chicken Tikka Pizza (Medium)', price:880, cat:'Pizza', tag:'Local', img:'images/pizza.png'},
    {id:'p3', name:'Chicken Tikka Pizza (Large)', price:1250, cat:'Pizza', tag:'Local', img:'images/pizza.png'},
    {id:'p4', name:'Fajita Pizza (Medium)', price:880, cat:'Pizza', tag:'Spicy', img:'images/pizza.png'},
    {id:'p5', name:'Fajita Pizza (Large)', price:1250, cat:'Pizza', tag:'Spicy', img:'images/pizza.png'},
    {id:'p6', name:'Creamy Pizza (Large)', price:1250, cat:'Pizza', tag:'Rich', img:'images/pizza.png'},
    {id:'p7', name:'Karachi Special Pizza (Large)', price:1250, cat:'Pizza', tag:'Loaded', img:'images/pizza.png'},
    {id:'p8', name:'Karachi Special Pizza (X-Large)', price:1890, cat:'Pizza', tag:'Party', img:'images/pizza.png'},
    
    // SHAWARMA & ROLLS
    {id:'s1', name:'Chicken Shawarma', price:230, cat:'Shawarma', tag:'Quick', img:'images/shawarma.png'},
    {id:'s2', name:'Signature Shawarma', price:350, cat:'Shawarma', tag:'Special', img:'images/shawarma.png'},
    {id:'s3', name:'Zinger Shawarma', price:380, cat:'Shawarma', tag:'Crispy', img:'images/shawarma.png'},
    {id:'s4', name:'Cheesy Shawarma', price:380, cat:'Shawarma', tag:'Cheesy', img:'images/shawarma.png'},
    {id:'s5', name:'Chicken Paratha Roll', price:280, cat:'Shawarma', tag:'Desi', img:'images/shawarma.png'},
    {id:'s6', name:'Zinger Paratha Roll', price:400, cat:'Shawarma', tag:'Crispy', img:'images/shawarma.png'},
    
    // SANDWICHES
    {id:'sw1', name:'Chicken Sandwich', price:380, cat:'Sandwiches', tag:'Classic', img:'images/sandwich.png'},
    {id:'sw2', name:'Fajita Sandwich', price:480, cat:'Sandwiches', tag:'Spicy', img:'images/sandwich.png'},
    {id:'sw3', name:'Cheesy Grill Sandwich', price:510, cat:'Sandwiches', tag:'Cheesy', img:'images/sandwich.png'},
    {id:'sw4', name:'Club Sandwich', price:510, cat:'Sandwiches', tag:'Classic', img:'images/sandwich.png'},

    // WRAPS
    {id:'w1', name:'Thousand Wrap', price:600, cat:'Wraps', tag:'Saucy', img:'images/wrap.png'},
    {id:'w2', name:'Chipotle Wrap', price:600, cat:'Wraps', tag:'Spicy', img:'images/wrap.png'},
    {id:'w3', name:'Garlic Wrap', price:600, cat:'Wraps', tag:'Garlic', img:'images/wrap.png'},
    {id:'w4', name:'Cheesy Wrap', price:670, cat:'Wraps', tag:'Cheesy', img:'images/wrap.png'},
    {id:'w5', name:'Anabei Wrap', price:650, cat:'Wraps', tag:'Special', img:'images/wrap.png'},
    {id:'w6', name:'Turkish Wrap', price:650, cat:'Wraps', tag:'Special', img:'images/wrap.png'},

    // FRIES & SIDES
    {id:'f1', name:'Regular Fries (Medium)', price:240, cat:'Fries', tag:'Salted', img:'images/fries.png'},
    {id:'f2', name:'Regular Fries (Large)', price:350, cat:'Fries', tag:'Salted', img:'images/fries.png'},
    {id:'f3', name:'Bar B Q Smoke Fries (Medium)', price:240, cat:'Fries', tag:'BBQ', img:'images/fries.png'},
    {id:'f4', name:'Chatpata Fries (Medium)', price:240, cat:'Fries', tag:'Spicy', img:'images/fries.png'},
    {id:'f5', name:'Loaded Fries (Medium)', price:380, cat:'Fries', tag:'Loaded', img:'images/fries.png'},
    {id:'f6', name:'Loaded Fries (Large)', price:650, cat:'Fries', tag:'Loaded', img:'images/fries.png'},
    {id:'f7', name:'Zinger Loaded Fries (Medium)', price:480, cat:'Fries', tag:'Premium', img:'images/fries.png'},
    {id:'f8', name:'Zinger Loaded Fries (Large)', price:950, cat:'Fries', tag:'Premium', img:'images/fries.png'},
    
    // CRISPY CORNER
    {id:'cc1', name:'Hot Wings (5 Pcs)', price:400, cat:'Crispy Corner', tag:'Spicy', img:'images/wings.png'},
    {id:'cc2', name:'Hot Wings (10 Pcs)', price:700, cat:'Crispy Corner', tag:'Spicy', img:'images/wings.png'},
    {id:'cc3', name:'Nuggets (5 Pcs)', price:350, cat:'Crispy Corner', tag:'Crispy', img:'images/wings.png'},
    {id:'cc4', name:'Nuggets (10 Pcs)', price:600, cat:'Crispy Corner', tag:'Crispy', img:'images/wings.png'},

    // BEVERAGES
    {id:'bev1', name:'Pepsi (345ml)', price:80, cat:'Beverages', tag:'Chilled', img:'images/beverage.png'},
    {id:'bev2', name:'7 Up (345ml)', price:80, cat:'Beverages', tag:'Chilled', img:'images/beverage.png'},
    {id:'bev3', name:'Dew (345ml)', price:80, cat:'Beverages', tag:'Chilled', img:'images/beverage.png'},
    {id:'bev4', name:'Fanta (345ml)', price:80, cat:'Beverages', tag:'Chilled', img:'images/beverage.png'},
    {id:'bev5', name:'Sting (345ml)', price:90, cat:'Beverages', tag:'Energy', img:'images/beverage.png'},
    {id:'bev6', name:'Mineral Water (500ml)', price:50, cat:'Beverages', tag:'Pure', img:'images/beverage.png'},
    {id:'bev7', name:'Mineral Water (1.5 Litre)', price:100, cat:'Beverages', tag:'Pure', img:'images/beverage.png'},

    // DIPS
    {id:'dip1', name:'Chipotle Dip', price:70, cat:'Dips', tag:'Spicy', img:'images/fries.png'},
    {id:'dip2', name:'Garlic Dip', price:70, cat:'Dips', tag:'Garlic', img:'images/fries.png'},
    {id:'dip3', name:'Thousand Island Dip', price:70, cat:'Dips', tag:'Tangy', img:'images/fries.png'}
  ]
};