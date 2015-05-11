
////////////////////////////////////////////////////
//Settings
////////////////////////////////////////////////////
var env = {};
env.production = false;
env.debugLevel = 2;
env.debugLabel = '';
env.themes = {};

//debug levels:
// 0 = NO DEBUG                 (production)
// 1 = one-off information      (e.g. "before/after problem appears" or "x is 5")
// 2 = command flow             (e.g. "now entering output loop")
// 3 = flow timing              (e.g. "starting at 14:22:00'")
// 4 = full dataset outputs     (e.g. a full table output - may be alerted)
