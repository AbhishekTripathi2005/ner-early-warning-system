-- Enable PostGIS Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

-- 1. Landslide Risk Zones (Polygons)
CREATE TABLE IF NOT EXISTS landslide_risk_zones (
    id SERIAL PRIMARY KEY,
    zone_code VARCHAR(50) UNIQUE NOT NULL,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    susceptibility_score FLOAT DEFAULT 0.0,
    slope_degrees FLOAT DEFAULT 0.0,
    antecedent_rainfall_72h FLOAT DEFAULT 0.0,
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(Polygon, 4326)
);

-- 2. Landslide Risk Points (800 Synthetic & Real Survey Points for Heatmaps)
CREATE TABLE IF NOT EXISTS landslide_risk_points (
    id SERIAL PRIMARY KEY,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    rainfall_24h FLOAT DEFAULT 0.0,
    rainfall_48h FLOAT DEFAULT 0.0,
    soil_moisture FLOAT DEFAULT 0.0,
    slope FLOAT DEFAULT 0.0,
    elevation FLOAT DEFAULT 0.0,
    land_use VARCHAR(100) DEFAULT 'Degraded Forest',
    distance_to_road FLOAT DEFAULT 0.0,
    historical_landslide INTEGER DEFAULT 0,
    state VARCHAR(50) DEFAULT 'NER',
    geom GEOMETRY(Point, 4326)
);

-- 3. Arterial Road Network Segments
CREATE TABLE IF NOT EXISTS road_network_segments (
    id SERIAL PRIMARY KEY,
    segment_code VARCHAR(50) UNIQUE NOT NULL,
    highway_name VARCHAR(100) NOT NULL,
    from_node VARCHAR(100) NOT NULL,
    to_node VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPERATIONAL',
    risk_score FLOAT DEFAULT 0.0,
    detour_advisory TEXT,
    geom GEOMETRY(LineString, 4326)
);

-- 4. Crowdsourced Citizen Reports
CREATE TABLE IF NOT EXISTS citizen_reports (
    id SERIAL PRIMARY KEY,
    reporter_name VARCHAR(100) DEFAULT 'Anonymous Citizen',
    reporter_phone VARCHAR(20),
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    state VARCHAR(50) DEFAULT 'NER',
    district VARCHAR(100) DEFAULT 'Hill Sector',
    hazard_type VARCHAR(50) DEFAULT 'Slope Creep / Crack',
    severity_reported VARCHAR(20) DEFAULT 'HIGH',
    description TEXT,
    photo_url VARCHAR(255),
    status VARCHAR(30) DEFAULT 'PENDING_REVIEW',
    reviewed_by_officer VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(Point, 4326)
);

-- 5. Field Officer Accounts
CREATE TABLE IF NOT EXISTS officer_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    badge_id VARCHAR(50) UNIQUE NOT NULL,
    agency VARCHAR(100) DEFAULT 'State Disaster Management Authority (SDMA)',
    state VARCHAR(50) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Emergency Alerts
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    evacuation_routes_advised TEXT,
    broadcasted_sms INTEGER DEFAULT 0,
    broadcasted_push INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active INTEGER DEFAULT 1
);

-- 7. Sensor Telemetry
CREATE TABLE IF NOT EXISTS sensor_telemetry (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(100) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    location_name VARCHAR(150),
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    reading_value FLOAT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(Point, 4326)
);

-- Spatial Indices (GiST)
CREATE INDEX IF NOT EXISTS idx_landslide_zones_geom ON landslide_risk_zones USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_landslide_points_geom ON landslide_risk_points USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_road_segments_geom ON road_network_segments USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_geom ON citizen_reports USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_sensors_geom ON sensor_telemetry USING GIST (geom);
