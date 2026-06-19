-- Run this script in your Supabase SQL Editor to add the report_settings column
ALTER TABLE public.store_settings ADD COLUMN IF NOT EXISTS report_settings jsonb DEFAULT '{}'::jsonb;
