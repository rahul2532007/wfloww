ALTER TABLE public.bookings DROP CONSTRAINT bookings_slot_id_fkey;
ALTER TABLE public.bookings ALTER COLUMN slot_id DROP NOT NULL;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES public.slots(id) ON DELETE SET NULL;