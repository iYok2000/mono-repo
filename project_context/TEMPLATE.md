# Feature Name Template

## Overview
Brief description of what this feature does and its role in the system.

## Why
**Business Requirements**:
- List the business needs this feature addresses
- User stories or requirements

**Technical Reasoning**:
- Why this approach was chosen
- What alternatives were considered

## How
**Architecture**:
- High-level design
- Components involved
- Data flow

**Implementation Details**:
- Key technical decisions
- Patterns used
- Integration points

## Code Examples

### Example 1: Main Implementation
```typescript
// Key code snippet showing the core implementation
interface Example {
  id: string;
  name: string;
}

export function exampleFunction(data: Example) {
  // Implementation
  return data;
}
```

### Example 2: Usage
```typescript
// How to use this feature
import { exampleFunction } from './feature';

const result = exampleFunction({ id: '1', name: 'Example' });
```

## Dependencies

### Internal Dependencies
- `@my-app/shared-types` - For type definitions
- `apps/backend-go` - API endpoints

### External Dependencies
- `library-name@version` - Purpose and why chosen

## API Endpoints (if applicable)

### GET /api/example
**Purpose**: Description  
**Request**: 
```typescript
// Request type
```
**Response**:
```typescript
// Response type
```

## Database Schema (if applicable)

```sql
-- Table definitions or schema
```

## Configuration

**Environment Variables**:
- `EXAMPLE_VAR` - Description and default value

**Settings**:
- Location: `config/example.ts`
- Key settings explained

## Testing

**Unit Tests**: Location and coverage  
**Integration Tests**: Key scenarios covered  
**Manual Testing**: Steps to verify

## Notes

### Important Considerations
- Security implications
- Performance characteristics
- Edge cases handled

### Known Issues
- Any current limitations
- Planned improvements

### Trade-offs Made
- What was sacrificed for what benefit
- Why this balance was chosen

---

**Created**: [Date]  
**Last Updated**: [Date]  
**Author**: [Human/AI]
