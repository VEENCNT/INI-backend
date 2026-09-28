ALTER TABLE likes
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN indicator_id SET NOT NULL;

ALTER TABLE biochemical_indicators
    DROP CONSTRAINT IF EXISTS biochemical_indicators_creator_id_fkey;

ALTER TABLE biochemical_indicators
    ALTER COLUMN creator_id SET NOT NULL,
    ADD CONSTRAINT biochemical_indicators_creator_id_fkey
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE CASCADE;