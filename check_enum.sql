-- Requête pour vérifier les valeurs acceptées par l'énumération project_type_enum
SELECT 
  UNNEST(ENUM_RANGE(NULL::project_type_enum)) AS enum_value;