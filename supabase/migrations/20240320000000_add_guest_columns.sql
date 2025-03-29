-- Add missing columns to guests table
ALTER TABLE guests
ADD COLUMN IF NOT EXISTS group_name TEXT,
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip TEXT,
ADD COLUMN IF NOT EXISTS meal_choice TEXT,
ADD COLUMN IF NOT EXISTS plus_one_name TEXT,
ADD COLUMN IF NOT EXISTS plus_one_meal_choice TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing records to set default values
UPDATE guests
SET group_name = '',
    dietary_restrictions = '',
    address = '',
    city = '',
    state = '',
    zip = '',
    meal_choice = '',
    plus_one_name = '',
    plus_one_meal_choice = '',
    notes = ''
WHERE group_name IS NULL; 