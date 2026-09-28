ALTER TABLE biochemical_indicators
    ALTER COLUMN lower_reference_limit SET NOT NULL,
    ALTER COLUMN upper_reference_limit SET NOT NULL,
    ADD CONSTRAINT biochemical_indicators_title_unique UNIQUE (title);