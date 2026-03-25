-- 🛡️ SOVEREIGN DATABASE OVERLORD: ELITE RLS POLICIES
-- Target: Supabase / PostgreSQL Engine

-- 1. 🛡️ ENABLE RLS ON ALL CORE TABLES
ALTER TABLE "Property" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Agency" ENABLE ROW LEVEL SECURITY;

-- 2. 🏘️ PROPERTY POLICIES
-- Anyone can view properties
CREATE POLICY "Public Properties: Readable" ON "Property"
FOR SELECT USING (true);

-- Only Admins or Managing Agency can modify
CREATE POLICY "Elite Properties: Write Access" ON "Property"
FOR ALL TO authenticated
USING (
  auth.jwt() ->> 'role' = 'ADMIN' OR 
  "agencyId"::text = (auth.jwt() ->> 'agencyId')
);

-- 3. 💳 BOOKING POLICIES
-- Users can only see their own bookings
CREATE POLICY "Sovereign Bookings: Own Access" ON "Booking"
FOR SELECT TO authenticated
USING ( "guestId"::text = auth.uid() );

-- Admins can see all bookings
CREATE POLICY "Sovereign Bookings: Admin View" ON "Booking"
FOR SELECT TO authenticated
USING ( auth.jwt() ->> 'role' = 'ADMIN' );

-- 4. ⭐ REVIEW POLICIES
-- Anyone can read reviews
CREATE POLICY "Public Reviews: Readable" ON "Review"
FOR SELECT USING (true);

-- Only owners can modify their reviews
CREATE POLICY "Sovereign Reviews: Owner Access" ON "Review"
FOR ALL TO authenticated
USING ( "userId"::text = auth.uid() );

-- 5. 👤 USER POLICIES
-- Users can only see their own profile data
CREATE POLICY "Sovereign Users: Identity Protection" ON "User"
FOR ALL TO authenticated
USING ( id::text = auth.uid() );

-- Admins carry master key
CREATE POLICY "Sovereign Users: Admin Overlord" ON "User"
FOR ALL TO authenticated
USING ( auth.jwt() ->> 'role' = 'ADMIN' );

-- 6. 💎 SECURITY HARDENING: VIEWS & FUNCTIONS
-- Create a secure audit log trigger (example)
CREATE OR REPLACE FUNCTION log_property_update()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "AuditLog" ("action", "table", "recordId", "changedBy")
  VALUES ('UPDATE', 'Property', NEW.id, auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🔐 DATABASE SECURITY STATUS
SELECT '✅ Sovereign Database Hardened: RLS Enforced' AS STATUS;
