# NDIS Connect Platform

A modern, responsive public-facing website for  conn ecting NDIS participants with service providers. Built with React and Tailwind CSS.
 
## Features  
 
### Pages Implemented  

1. **Landing Page**
   - Hero section with gradient background
   - Event Calendar section (Eventbrite integration ready)
   - Facebook community link
   - Join Us section with dual CTAs
   - Featured Providers scrolling logos
   - CTA section

2. **About Us Page**
   - Mission and Vision statements
   - Detailed introduction
   - Core Values section with icons (Support, Innovation, Empowerment, Quality)
   - Team section (placeholder)
   - Statistics section

3. **Subscription Page**
   - Basic Plan (Free)
   - Premium Plan ($29/month)
   - Feature comparison
   - Provider subscription CTA
   - FAQ section

4. **Contact Page**
   - Contact form (Name, Email, Subject, Message)
   - Contact information (Email, Phone, Address)
   - Social media links (Facebook, LinkedIn, YouTube)
   - Map section with yellow accent
   - Office hours

5. **Support Pages (Placeholders)**
   - Support for Participants
   - Provider Support
   - Login page

### Design Elements

**Color Palette (Custom Tailwind Colors)**
- `ndis-green`: #00B894 - Support and growth
- `ndis-red`: #FF6B6B - Innovation and emphasis
- `ndis-yellow`: #FFD93D - Call-to-action buttons
- `ndis-purple`: #6C5CE7 - Featured elements and headings

**Typography**
- Clean, modern sans-serif fonts
- Responsive text sizing
- Clear hierarchy

**Layout**
- Fully responsive (mobile, tablet, desktop)
- Clean white backgrounds for readability
- Generous white space
- Grid-based layouts using Tailwind

**Interactive Elements**
- Rounded buttons with hover effects
- Smooth transitions
- Shadow effects on cards
- Hover states for links

## Project Structure

```
ndis-platform/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation bar
│   │   └── Footer.jsx          # Footer with links
│   ├── pages/
│   │   ├── LandingPage.jsx     # Home page
│   │   ├── AboutPage.jsx       # About us
│   │   ├── SubscriptionPage.jsx # Plans
│   │   ├── ContactPage.jsx     # Contact form
│   │   ├── SupportPage.jsx     # Participant support
│   │   ├── LoginPage.jsx       # Login placeholder
│   │   └── ProviderSupportPage.jsx # Provider resources
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind directives
├── tailwind.config.js          # Tailwind configuration
└── package.json
```

## Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## Customization Guide

### Update Content

**Brand Name**
- Update "NDIS Connect" in `Header.jsx` and `Footer.jsx`

**Events**
- Modify `upcomingEvents` array in `LandingPage.jsx`
- Add real Eventbrite links

**Featured Providers**
- Update `featuredProviders` array in `LandingPage.jsx`
- Replace placeholder text with actual provider names/logos

**Team Members**
- Update team section in `AboutPage.jsx` with real profiles

**Contact Information**
- Update email, phone, and address in `ContactPage.jsx` and `Footer.jsx`

### Replace Placeholders

**Maps**
- Replace map placeholder in `ContactPage.jsx` with Google Maps embed:
```html
<iframe 
  src="YOUR_GOOGLE_MAPS_EMBED_URL"
  className="w-full h-96 rounded-lg"
  loading="lazy"
></iframe>
```

**Logo Images**
- Replace text placeholders with actual images in `Footer.jsx`
- Add provider logos in `LandingPage.jsx`

**Social Media Links**
- Update URLs in `Footer.jsx` and `ContactPage.jsx`

### Colors

To modify the color scheme, update `tailwind.config.js`:

```javascript
colors: {
  'ndis-green': '#YOUR_COLOR',
  'ndis-red': '#YOUR_COLOR',
  'ndis-yellow': '#YOUR_COLOR',
  'ndis-purple': '#YOUR_COLOR',
}
```

## Navigation Structure

- Home → `/`
- About Us → `/about`
- Support for Participants → `/support`
- Login → `/login` (placeholder)
- Provider Support → `/provider-support` (placeholder)
- Contact → `/contact`
- Subscription Plans → `/subscription`

## Technologies Used

- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixing

## Future Integration Points

This is a frontend-only static UI. Future backend integration points:

1. **Authentication**
   - User registration and login
   - Session management
   - Password reset

2. **Forms**
   - Contact form submission
   - Subscription payment processing
   - Provider registration

3. **Dynamic Content**
   - Provider database and search
   - Event management system
   - User profiles and dashboards

4. **APIs**
   - Eventbrite API integration
   - Payment gateway (Stripe/PayPal)
   - Email service integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is a template for NDIS-related platforms. Customize as needed for your specific use case.
