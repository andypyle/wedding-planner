-- Drop existing columns if they exist
ALTER TABLE guests
DROP COLUMN IF EXISTS group,
DROP COLUMN IF EXISTS dietary_restrictions;

-- Add new columns
ALTER TABLE guests
ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS state TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS zip TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS meal_choice TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS plus_one_name TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS plus_one_meal_choice TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

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