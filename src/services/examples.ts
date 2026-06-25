export interface DeckExample {
  name: string;
  startup: string;
  description: string;
  content: string;
}

export const DECK_EXAMPLES: DeckExample[] = [
  {
    name: "Airbnb",
    startup: "Airbnb (YC W09)",
    description: "Early-stage pitch deck that went on to become a $100B+ company",
    content: `Slide 1: Cover - Airbnb - Book rooms with locals, travel like a human

Slide 2: Problem - Hotel rooms are expensive and impersonal. Travelers want authentic local experiences but don't know where to start. Meanwhile, millions of people have spare rooms sitting empty.

Slide 3: Solution - A peer-to-peer marketplace where anyone can list their spare space and travelers can book unique, affordable accommodations directly from locals. We handle payments, insurance, and trust & safety.

Slide 4: Product - Beautiful search interface with maps, photos, and reviews. Instant booking with secure payment processing. Host dashboard with calendar management and pricing tools.

Slide 5: Market - The global travel accommodation market is $500B+. Existing online travel agencies (Expedia, Booking.com) only cover hotels. Airbnb unlocks the $100B+ private accommodation market that is currently offline and fragmented.

Slide 6: Business Model - We take a 6-12% commission from guests on each booking and 3% from hosts. Light asset model with high gross margins. Network effects: more listings attract more travelers, which attracts more listings.

Slide 7: Traction - Launched 6 months ago. 10,000+ bookings processed. 2,500 active listings across 200 cities. 40% month-over-month growth. 85% repeat booking rate. Featured in NYT and TechCrunch.

Slide 8: GTM - Grassroots host acquisition through Craigslist integration, local meetups, and photography program. Guest acquisition through SEO, viral sharing, and PR. Partnerships with event organizers.

Slide 9: Team - Founders are designers and engineers who have lived the problem. Brian Chesky (CEO) - Rhode Island School of Design. Joe Gebbia (CPO) - RISD. Nathan Blecharczyk (CTO) - Harvard CS, former CTO of Oomo.

Slide 10: Ask - Raising $600K seed round to expand engineering team, launch in 10 new cities, and build mobile apps.`,
  },
  {
    name: "Uber",
    startup: "Uber (2008)",
    description: "The ride-hailing giant's early pitch deck showcasing massive TAM",
    content: `Slide 1: Cover - UberCab - Your Private Driver on Demand

Slide 2: Problem - Getting a reliable taxi in major cities is frustrating. Hailing takes too long, payment is inconvenient, and service quality is inconsistent. In San Francisco, average taxi wait time is 15+ minutes.

Slide 3: Solution - A mobile app that connects riders with professional drivers. Request a car with one tap. See your driver approaching in real-time. Automatic payment. Rating system ensures quality. No cash needed.

Slide 4: Product - iPhone app with GPS tracking, one-tap booking, estimated fare, and driver ratings. Driver app with navigation, passenger info, and earnings dashboard. Web backend for operations and analytics.

Slide 5: Market - The US ground transportation market is $100B+. Of this, taxis represent $11B, limos $18B, and rental cars $24B. But more importantly, there are 700M+ taxi rides per year in the US alone. We're initially targeting urban professionals aged 25-45 in major cities.

Slide 6: Business Model - 20% commission on each fare. Surge pricing during high demand. Projected to reach $1B+ in gross revenue by year 3. Path to 35%+ net margins at scale.

Slide 7: Traction - Launched beta in San Francisco with 15 cars. 2,000+ rides completed. 4.8 star average rating. 90% of riders who try Uber use it again within 2 weeks. Wait time reduced from 15 min to under 5 min.

Slide 8: GTM - Start city by city with a dedicated operations team. Target early adopters through tech events, PR, and referral program. Expand to 10 cities in year 1. Partnerships with hotels and event venues.

Slide 9: Team - Travis Kalanick (CEO) - Founded Red Swoosh (acquired by Akamai). Garrett Camp (Founder) - Founded StumbleUpon. Strong engineering team from Google, Amazon, and Microsoft.

Slide 10: Ask - Raising $1.25M seed round to expand to 3 additional cities, hire engineering team, and build Android app.`,
  },
  {
    name: "Mint.com",
    startup: "Mint.com (acquired by Intuit for $170M)",
    description: "A legendary pitch deck that secured funding and an exit",
    content: `Slide 1: Cover - Mint.com - Take Control of Your Finances

Slide 2: Problem - Personal finance management is broken. 70% of Americans live paycheck to paycheck. People don't budget because existing tools are too complex, manual, and time-consuming. Excel spreadsheets and desktop software feel like work.

Slide 3: Solution - A free, web-based personal finance platform that automatically pulls all your accounts into one place. Categorizes transactions. Creates budgets. Sends alerts. Shows exactly where your money is going. No data entry required.

Slide 4: Product - Clean dashboard with account aggregation, automatic categorization, budget tracking, goal setting, and personalized money-saving recommendations. Bank-level 256-bit encryption security.

Slide 5: Market - 100M+ Americans who manage their finances online. $2B+ market for personal finance software. Current leaders (Quicken, Microsoft Money) are desktop-based with zero innovation in years. Mobile is completely underserved.

Slide 6: Business Model - Free for consumers. Revenue from personalized financial product recommendations (credit cards, loans, investments). Estimated $30-60 ARPU through targeted offers. Similar to Google's advertising model.

Slide 7: Traction - 100,000+ users in first 3 months without any paid marketing. 40% month-over-month growth. $1.2M in annual revenue run rate from recommendations. Average user adds 4 accounts. 80% retention after 6 months.

Slide 8: GTM - SEO-driven content strategy (personal finance blog). Viral sharing through budget reports. Partnerships with credit unions and banks. PR targeting personal finance journalists.

Slide 9: Team - Aaron Patzer (CEO) - Computer Science, Duke University. Former engineer at Synaptics. Built Mint entirely before raising funding. Small team of 5 engineers from top tech companies.

Slide 10: Ask - Raising $4M Series A to expand engineering team, launch mobile apps, and build recommendation engine.`,
  },
];
