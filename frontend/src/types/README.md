# Types

This directory contains TypeScript type definitions and interfaces.

## Available Types

### Core Entities
- **Film** (`film.ts`): Film entity with create/update request types
- **Actor** (`actor.ts`): Actor entity with create/update request types
- **Rating** (`rating.ts`): Rating enum (G, PG, PG-13, R, NC-17)
- **User** (`user.ts`): User entity and authentication types

### API Types
- **API** (`api.ts`): Error responses, success responses, and pagination types

### Usage
Import types from the central index file:
```typescript
import { Film, Actor, Rating, User, LoginRequest } from './types';
```
