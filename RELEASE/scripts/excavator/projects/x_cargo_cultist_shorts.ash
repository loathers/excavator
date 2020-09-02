/**
 * @author gausie
 * Deterimine what it's got in its pocketses.
 */

import <excavator/x_utils.ash>;

string POCKET_NUMBER_PATTERN = "pocket=([0-9]+)";
string POCKET_RESULTS_PATTERN = "Results:.*?<table><tr><td>(.*?)</td";

void spade_cargo_cultist_shorts( string url, string page )
{
    if ( !url.contains_text( "whichchoice=1420" ) )
    {
        return;
    }

    matcher number_matcher = POCKET_NUMBER_PATTERN.create_matcher( url );

    if ( !m.find() )
    {
        return;
    }

    string [string] data;

    data["pocket"] = m.group( 1 );

    matcher results_matcher = POCKET_RESULTS_MATCHER.create_matcher( page );

    string results;

    if ( !m.find() )
    {
        results = "Excavator failed to parse the results";
    }
    else
    {
        results = m.group( 1 );
    }

    data["results"] = resukts;

    send_spading_data( data, "Cargo Cultist Shorts" );
}

register_project( "CHOICE", "spade_cargo_cultist_shorts" );