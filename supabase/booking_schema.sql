-- Booking-specific schema additions
-- Add your booking-related tables here

-- Example booking schema:

-- CREATE TABLE IF NOT EXISTS public.booking_slots (
--     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
--     date DATE NOT NULL,
--     start_time TIME NOT NULL,
--     end_time TIME NOT NULL,
--     is_available BOOLEAN DEFAULT true,
--     provider_id UUID,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
-- );

-- CREATE INDEX idx_booking_slots_date ON public.booking_slots(date);
-- CREATE INDEX idx_booking_slots_available ON public.booking_slots(is_available);
