# ImmTest - React Native Shopping Cart Application

For the development of this test, take into account the following assumptions:
- Same pictures have been used for all the products for simplicity. In a real scenario we could get this pictures from backend
- The split payment functionality has been skip since I didn't really understand what was expected from this feature.
- All API calls are mocks from my-json-server, and will always return a 200. So no error handling has been implemented.
- The app test are in Spanish since the provided UI is in Spanish.

## 🚀 Main Features

### Core Functionality

- **Product Management**: Browse and add products to cart with real-time inventory tracking
- **Shopping Cart**: Full cart functionality with item modification, removal, and total calculations
- **Payment Processing**: Multi-payment method support (Cash/Card) with seat selection
- **Currency Support**: Multi-currency display (USD, EUR, GBP) with real-time conversion
- **User Types**: Dynamic pricing based on user roles (Tourist, Crew, Business, etc.) with automatic discount application

## 🏗️ Architecture Overview

### State Management - Redux Toolkit

The application uses **Redux Toolkit** for predictable state management with a clean, scalable architecture:

```
src/redux/
├── store.ts              # Store configuration with middleware
├── hooks.ts              # Typed useSelector and useDispatch hooks
├── cart/                 # Cart state management
│   ├── reducer.ts        # Cart actions and reducers
│   └── selectors.ts      # Memoized cart selectors
└── productStore/         # Product catalog management
    ├── reducer.ts        # Product actions and async thunks
    ├── selectors.ts      # Product data selectors
    └── thunk.ts          # API calls for products and payments
```

### Component Architecture - Atomic Design

```
src/components/
├── Badge/                # Small UI indicators
├── CurrencyPriceDisplay/ # Currency formatting and display
├── Modal/                # Reusable modal system
├── PaymentButton/        # Payment interaction component
├── ProductModal/         # Product details overlay
├── PurchaseItem/         # Individual cart item component
├── SeatSelector/         # Seat selection with modal
└── SwipeableRow/         # Gesture-enabled list items
```

**Design Principles:**

- **Single Responsibility**: Each component has a clear, focused purpose
- **Reusability**: Components designed for maximum reuse across screens
- **Composition**: Complex functionality built from simple, composable parts
- **Props Interface**: Clean, typed interfaces for component communication

### Screen Architecture - Feature-Based

```
src/screens/
├── CartScreen/           # Product catalog and cart management
│   ├── CartScreen.tsx    # Main screen component
│   └── styles.ts         # Screen-specific styling
└── PaymentScreen/        # Checkout and payment flow
    ├── PaymentScreen.tsx # Payment processing interface
    └── styles.ts         # Payment screen styling
```

### API Layer & Data Flow

```
src/services/
└── api.ts                # Centralized API service layer
```

**Data Flow Pattern:**

1. **Components** dispatch actions via typed hooks
2. **Async Thunks** handle API calls and side effects
3. **Reducers** update state immutably
4. **Selectors** provide computed state to components
5. **Components** re-render based on state changes

### Utility System

```
src/utils/
└── utils.ts              # Pure functions for business logic
```

**Key Utilities:**

- **Currency Conversion**: Real-time currency calculations
- **Price Formatting**: Consistent price display across the app
- **Discount Calculations**: User-type based pricing logic

## 🛠️ Technology Stack

### Core Technologies

- **React Native 0.81.4**: Latest stable version with New Architecture support
- **TypeScript**: Full type safety across the entire application
- **Redux Toolkit**: Modern Redux with RTK Query for API management

### UI & Animation

- **React Native Reanimated**: High-performance animations and gestures
- **React Native Gesture Handler**: Native gesture recognition
- **Flash List**: Optimized, high-performance list rendering

### Navigation & State

- **React Navigation 7**: Type-safe navigation with stack patterns
- **React Redux**: Optimized React-Redux bindings with hooks



## 🧪 Testing Strategy

### Comprehensive Test Coverage (92.5%)

- **Unit Tests**: Individual component and utility function testing
- **Integration Tests**: Redux store and API interaction testing
- **Component Tests**: User interaction and rendering validation
- **Mock Strategy**: Sophisticated mocking for React Native dependencies

### Test Architecture

```
__tests__/
├── components/           # Component behavior testing
├── screens/              # Screen integration testing
├── redux/                # State management testing
├── services/             # API layer testing
└── hooks/                # Custom hook testing
```

## 🚦 Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment
- iOS Simulator or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# iOS setup (macOS only)
 npx pod-install 

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Development Commands

```bash
# Run tests
npm test

# Lint code
npm run lint
```

