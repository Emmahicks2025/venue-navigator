// Local performer images - bundled with the app for any hosting provider
import taylorSwift from './taylor-swift.jpg';
import edSheeran from './ed-sheeran.jpg';
import beyonce from './beyonce.jpg';
import theWeeknd from './the-weeknd.jpg';
import brunoMars from './bruno-mars.jpg';
import postMalone from './post-malone.jpg';
import badBunny from './bad-bunny.jpg';
import morganWallen from './morgan-wallen.jpg';
import nbaBasketball from './nba-basketball.jpg';
import basketballCourt from './basketball-court.jpg';
import hockey from './hockey.jpg';
import hockeyArena from './hockey-arena.jpg';
import football from './football.jpg';
import footballStadium from './football-stadium.jpg';
import baseball from './baseball.jpg';
import comedy from './comedy.jpg';
import theater from './theater.jpg';
import rodeo from './rodeo.jpg';
import ufc from './ufc.jpg';
import racing from './racing.jpg';
import festival from './festival.jpg';
import theaterStage from './theater-stage.jpg';
import dance from './dance.jpg';

// Performer name to local image mapping
export const localPerformerImages: Record<string, string> = {
  // Top music artists
  'Taylor Swift': taylorSwift,
  'Ed Sheeran': edSheeran,
  'Beyoncé': beyonce,
  'The Weeknd': theWeeknd,
  'Bruno Mars': brunoMars,
  'Post Malone': postMalone,
  'Bad Bunny': badBunny,
  'Morgan Wallen': morganWallen,
  'Billie Eilish': edSheeran,
  'Kendrick Lamar': theWeeknd,
  'Luke Combs': morganWallen,
  'Zach Bryan': morganWallen,
  'Imagine Dragons': theWeeknd,
  'Coldplay': brunoMars,
  'U2': theWeeknd,
  'Foo Fighters': postMalone,
  'Metallica': theWeeknd,
  'Drake': theWeeknd,
  'Travis Scott': theWeeknd,
  'Usher': theWeeknd,
  
  // Sports - NBA
  'LA Clippers': nbaBasketball,
  'Los Angeles Clippers': nbaBasketball,
  'Los Angeles Lakers': basketballCourt,
  'LA Lakers': basketballCourt,
  'Golden State Warriors': basketballCourt,
  'Brooklyn Nets': basketballCourt,
  'New York Knicks': basketballCourt,
  'Miami Heat': nbaBasketball,
  'Boston Celtics': basketballCourt,
  'Chicago Bulls': nbaBasketball,
  
  // Sports - NHL
  'New York Rangers': hockey,
  'LA Kings': hockey,
  'Los Angeles Kings': hockey,
  'Colorado Avalanche': hockeyArena,
  'Vegas Golden Knights': hockey,
  'Seattle Kraken': hockeyArena,
  
  // Sports - NFL
  'Denver Broncos': football,
  'Houston Texans': footballStadium,
  'LA Rams': football,
  'Los Angeles Rams': football,
  'Dallas Cowboys': footballStadium,
  'New England Patriots': footballStadium,
  'Kansas City Chiefs': football,
  'Philadelphia Eagles': football,
  
  // Sports - MLB
  'New York Yankees': baseball,
  'Boston Red Sox': baseball,
  'Los Angeles Dodgers': baseball,
  'Chicago Cubs': baseball,
  
  // Sports - Other
  'UFC': ufc,
  'NASCAR': racing,
  'Formula 1': racing,
  'Rodeo': rodeo,
  'Fort Worth Stock Show & Rodeo': rodeo,
  'PBR': rodeo,
  
  // Comedy
  'Kevin Hart': comedy,
  'Dave Chappelle': comedy,
  'Chris Rock': comedy,
  'Sebastian Maniscalco': comedy,
  'Joe Rogan': comedy,
  
  // Theater
  'Wicked': theater,
  'Hamilton': theater,
  'The Lion King': theater,
  'Phantom of the Opera': theater,
  'Dancing With The Stars': dance,
};

// Category default images
export const localCategoryImages = {
  concerts: theWeeknd,
  sports: nbaBasketball,
  theater: theater,
  comedy: comedy,
  festivals: festival,
};

export default localPerformerImages;
