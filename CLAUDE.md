# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for "Eternal" - a business holding company that showcases portfolio companies including Zomato, Blinkit, District, and Hyperpure. The site is built using pure HTML, CSS, and JavaScript with no build process or package management.

## Architecture

### File Structure
- `index.html` - Main HTML file with complete page structure
- `styles/` - CSS files organized by concern:
  - `main.css` - Core styles, variables, typography, and base components
  - `components.css` - Component-specific styling 
  - `responsive.css` - Media queries and responsive design
- `scripts/` - JavaScript modules:
  - `main.js` - Core functionality, carousel, navigation, and DOM interactions
  - `animations.js` - Animation controller with scroll-triggered effects, parallax, counters
  - `interactions.js` - Enhanced user interactions, modals, forms, accessibility features
- `images/` - Business logos and content images
- `assets/` - Static assets like favicon

### Key Components
- **Hero Section**: Large header with company messaging and founder card
- **Business Carousel**: Interactive showcase of portfolio companies with hover effects
- **Vision/Mission Sections**: Split-layout content areas with images
- **Responsive Navigation**: Mobile-friendly navbar with hamburger menu
- **Footer**: Company links and legal information

## Development Workflow

### No Build Process
This is a static site with no compilation, transpilation, or package management. Files can be edited directly and served immediately.

### Testing
- Open `index.html` directly in browser for local development
- Use browser dev tools for debugging
- Test responsive design using device emulation
- Verify accessibility with screen readers and keyboard navigation

### Styling Approach
- CSS Variables defined in `:root` for consistent theming
- Mobile-first responsive design with `clamp()` for fluid typography
- Component-based CSS organization
- Hover and focus states for accessibility

### JavaScript Architecture
- Vanilla JavaScript with ES6+ features
- Class-based architecture for animations and interactions
- Event delegation and intersection observers for performance
- Accessibility features built-in (ARIA labels, keyboard navigation, screen reader support)

## Key Features

### Interactive Elements
- **Business Card Hover Effects**: 3D transforms and mouse tracking (scripts/main.js:56-75)
- **Carousel Navigation**: Touch/swipe support with keyboard accessibility (scripts/main.js:4-55)
- **Smooth Scrolling**: Section navigation with active link highlighting (scripts/main.js:125-186)
- **Form Validation**: Real-time field validation with error messaging (scripts/interactions.js:108-261)

### Animation System
- **Scroll-triggered Animations**: Fade-in, slide effects with intersection observer (scripts/animations.js:16-69)
- **Parallax Effects**: Performance-optimized background movement (scripts/animations.js:125-169)
- **Counter Animations**: Eased number counting for statistics (scripts/animations.js:257-283)
- **Reduced Motion Support**: Respects user preferences for accessibility (scripts/animations.js:5, 42-46)

### Accessibility Features
- **Keyboard Navigation**: Full site navigable via keyboard
- **Screen Reader Support**: ARIA labels, live regions, skip links (scripts/interactions.js:518-595)
- **Focus Management**: Visible focus indicators and logical tab order
- **High Contrast Mode**: Detection and styling adjustments

## Common Tasks

### Adding New Business Cards
1. Add image to `images/` directory
2. Insert new `.business-card` div in the carousel track (index.html:94-118)
3. Update business logo image source and alt text
4. No JavaScript changes needed - carousel automatically adapts

### Modifying Styles
- Global colors/spacing: Update CSS variables in `styles/main.css:9-25`
- Component styling: Edit specific component files
- Responsive breakpoints: Modify `styles/responsive.css`

### Adding Interactive Features
- Simple interactions: Add to `scripts/main.js`
- Complex interactions/modals: Extend `scripts/interactions.js`
- Animations: Use `scripts/animations.js` methods or create new ones

### Performance Considerations
- Images use lazy loading attributes (`loading="lazy"`)
- Animations are throttled using `requestAnimationFrame`
- Intersection observers minimize scroll event listeners
- Event delegation reduces memory footprint

## Browser Support
- Modern browsers with ES6+ support
- CSS Grid and Flexbox
- Intersection Observer API
- Touch events for mobile interaction