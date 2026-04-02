# Backend Development & Fixes TODO

Status: 0/12 ✅ (Approved plan from BLACKBOXAI)

## Priority 1: Critical Fixes (Types & Runtime)
- [✅] 1. Update backend/src/db/mysql.ts - Add typed execute/query helpers
- [✅] 2. Fix 'any' casts in backend/src/routes/auth.ts & reports.ts
- [✅] 3. Clean console.logs/errors in backend/src/server.ts

## Priority 2: Complete Core APIs
- [ ] 4. Enhance backend/src/routes/reports.ts - Full CRUD + multer image upload
- [ ] 5. Add /me endpoint to backend/src/routes/users.ts
- [ ] 6. Improve backend/src/routes/classify.ts - POST with image mock

## Priority 3: Polish & Security
- [✅] 7. Create backend/src/middleware/upload.ts (multer config)
- [✅] 8. Create backend/.env.example
- [✅] 9. Update types in backend/src/types/index.ts

## Priority 4: Testing & Integration
- [✅] 10. Update root package.json scripts, run bun install in backend
- [ ] 11. Test endpoints (health, auth, reports CRUD)
- [ ] 12. Frontend compatibility checks (api.ts integration)
