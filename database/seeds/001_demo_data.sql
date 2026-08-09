INSERT INTO sports (name, slug, icon, sort_order) VALUES ('Football','football','⚽',1),('Basketball','basketball','🏀',2),('Tennis','tennis','🎾',3),('Esports','esports','🎮',4),('Cricket','cricket','🏏',5),('Rugby','rugby','🏉',6);

DO $$ DECLARE fs UUID; bs UUID; ts UUID; es UUID;
BEGIN
  SELECT id INTO fs FROM sports WHERE slug='football';
  SELECT id INTO bs FROM sports WHERE slug='basketball';
  SELECT id INTO ts FROM sports WHERE slug='tennis';
  SELECT id INTO es FROM sports WHERE slug='esports';
  
  INSERT INTO competitions (sport_id,name,slug,country,country_name) VALUES
    (fs,'Premier League','epl','GB','England'),(fs,'La Liga','la-liga','ES','Spain'),
    (fs,'Serie A','serie-a','IT','Italy'),(fs,'Bundesliga','bundesliga','DE','Germany'),
    (fs,'Champions League','ucl','EU','Europe'),
    (bs,'NBA','nba','US','United States'),(bs,'EuroLeague','euroleague','EU','Europe'),
    (ts,'ATP Tour','atp','WW','Worldwide'),(ts,'WTA Tour','wta','WW','Worldwide'),
    (es,'CS2 Majors','cs2','WW','Worldwide'),(es,'LoL Worlds','lol','WW','Worldwide');

  INSERT INTO events (sport_id,competition_id,home_team,away_team,start_time,status,is_live)
  SELECT fs, c.id, 'Arsenal', 'Chelsea', NOW()-INTERVAL'30 min','LIVE',true FROM competitions c WHERE c.slug='epl';
  INSERT INTO events (sport_id,competition_id,home_team,away_team,start_time,status,is_live)
  SELECT fs, c.id, 'Manchester City', 'Liverpool', NOW()+INTERVAL'1 hour','UPCOMING',false FROM competitions c WHERE c.slug='epl';
  INSERT INTO events (sport_id,competition_id,home_team,away_team,start_time,status,is_live)
  SELECT fs, c.id, 'Barcelona', 'Real Madrid', NOW()+INTERVAL'2 hours','UPCOMING',false FROM competitions c WHERE c.slug='la-liga';
  INSERT INTO events (sport_id,competition_id,home_team,away_team,start_time,status,is_live)
  SELECT bs, c.id, 'LA Lakers', 'Warriors', NOW()-INTERVAL'15 min','LIVE',true FROM competitions c WHERE c.slug='nba';
  INSERT INTO events (sport_id,competition_id,home_team,away_team,start_time,status,is_live)
  SELECT ts, c.id, 'Djokovic', 'Medvedev', NOW()-INTERVAL'45 min','LIVE',true FROM competitions c WHERE c.slug='atp';
  INSERT INTO events (sport_id,competition_id,home_team,away_team,start_time,status,is_live)
  SELECT es, c.id, 'FaZe Clan', 'NaVi', NOW()+INTERVAL'1 hour','UPCOMING',false FROM competitions c WHERE c.slug='cs2';

  UPDATE events SET home_score=1,away_score=0,clock='32''' WHERE home_team='Arsenal';
  UPDATE events SET home_score=56,away_score=52,clock='Q2 4:30' WHERE home_team='LA Lakers';
  UPDATE events SET home_score=2,away_score=3,clock='3rd Set' WHERE home_team='Djokovic';
END $$;

INSERT INTO vip_tiers (name,level,min_points,benefits) VALUES
  ('Bronze',1,0,'{"cashback":0}'),('Silver',2,1000,'{"cashback":2}'),
  ('Gold',3,5000,'{"cashback":5}'),('Platinum',4,25000,'{"cashback":8}'),
  ('Diamond',5,100000,'{"cashback":12}');

INSERT INTO promotions (name,description,type,code,max_bonus,bonus_percent,wagering_requirement,wagering_multiplier,starts_at,expires_at) VALUES
  ('Welcome Bonus','100% match on first deposit up to $500!','WELCOME','WELCOME100',500,100,10,10.0,NOW(),NOW()+INTERVAL'90 days'),
  ('Acca Boost','Up to 50% extra on 5+ selection accas!','ODDS_BOOST','ACCABOOST',1000,50,1,1.0,NOW(),NOW()+INTERVAL'30 days'),
  ('Daily Cashback','10% cashback on daily net losses','CASHBACK',NULL,100,10,1,1.0,NOW(),NOW()+INTERVAL'60 days');